; =============================================================================
; traffic_light.asm  —  Simple traffic light controller (x86-64 Linux / NASM)
; =============================================================================
; WHAT THIS PROGRAM DOES
;   Simulates a traffic light in the Ubuntu terminal:
;     RED    (stop)     -> wait
;     GREEN  (go)       -> wait
;     YELLOW (caution)  -> wait
;     then repeats
;
; HOW IT WORKS (big picture)
;   1. Print a colored light using ANSI escape codes
;   2. Sleep for a few seconds (Linux nanosleep system call)
;   3. Jump back and show the next light
;
; BUILD & RUN
;   nasm -f elf64 traffic_light.asm -o traffic_light.o
;   ld traffic_light.o -o traffic_light
;   ./traffic_light
;   Press Ctrl+C to stop
; =============================================================================

section .data

    ; Clear screen + move cursor home (ANSI)
    clear_seq:      db 27, "[2J", 27, "[H"
    clear_len:      equ $ - clear_seq

    ; Title line
    title:          db "=== TRAFFIC LIGHT CONTROL ===", 10, 10
    title_len:      equ $ - title

    ; RED light: bright red circle + label
    ; 27 = ESC character for ANSI color codes
    red_msg:        db 27, "[1;31m"          ; bold red text
                    db "    ( R )", 10
                    db "     RED", 10
                    db "    STOP", 10
                    db 27, "[0m"             ; reset color
    red_len:        equ $ - red_msg

    ; GREEN light
    green_msg:      db 27, "[1;32m"          ; bold green text
                    db "    ( G )", 10
                    db "    GREEN", 10
                    db "     GO", 10
                    db 27, "[0m"
    green_len:      equ $ - green_msg

    ; YELLOW light
    yellow_msg:     db 27, "[1;33m"          ; bold yellow text
                    db "    ( Y )", 10
                    db "   YELLOW", 10
                    db "  CAUTION", 10
                    db 27, "[0m"
    yellow_len:     equ $ - yellow_msg

    hint:           db 10, "Press Ctrl+C to exit", 10
    hint_len:       equ $ - hint

    ; timespec for nanosleep: { tv_sec, tv_nsec }
    ; Change tv_sec to make lights stay longer/shorter
    delay_red:      dq 3, 0                 ; RED stays 3 seconds
    delay_green:    dq 3, 0                 ; GREEN stays 3 seconds
    delay_yellow:   dq 1, 0                 ; YELLOW stays 1 second

section .text
    global _start

_start:
.loop:
    ; ----- RED -----
    call clear_screen
    mov rsi, title
    mov rdx, title_len
    call print
    mov rsi, red_msg
    mov rdx, red_len
    call print
    mov rsi, hint
    mov rdx, hint_len
    call print
    mov rdi, delay_red
    call sleep

    ; ----- GREEN -----
    call clear_screen
    mov rsi, title
    mov rdx, title_len
    call print
    mov rsi, green_msg
    mov rdx, green_len
    call print
    mov rsi, hint
    mov rdx, hint_len
    call print
    mov rdi, delay_green
    call sleep

    ; ----- YELLOW -----
    call clear_screen
    mov rsi, title
    mov rdx, title_len
    call print
    mov rsi, yellow_msg
    mov rdx, yellow_len
    call print
    mov rsi, hint
    mov rdx, hint_len
    call print
    mov rdi, delay_yellow
    call sleep

    jmp .loop                   ; repeat forever

; -----------------------------------------------------------------------------
; print: write RSI (buffer) of length RDX to stdout
;   uses Linux syscall write (rax = 1)
; -----------------------------------------------------------------------------
print:
    mov rax, 1                  ; sys_write
    mov rdi, 1                  ; fd = 1 (stdout)
    syscall
    ret

; -----------------------------------------------------------------------------
; clear_screen: wipe terminal and home cursor
; -----------------------------------------------------------------------------
clear_screen:
    mov rsi, clear_seq
    mov rdx, clear_len
    call print
    ret

; -----------------------------------------------------------------------------
; sleep: nanosleep using pointer in RDI (struct timespec *)
;   syscall nanosleep (rax = 35)
; -----------------------------------------------------------------------------
sleep:
    mov rax, 35                 ; sys_nanosleep
    xor rsi, rsi                ; remaining = NULL
    syscall
    ret
