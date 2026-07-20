# Traffic Light Control in Assembly (Ubuntu)

A beginner-friendly **x86-64 NASM** program that simulates a traffic light in the Ubuntu terminal.

## What you will learn

| Idea | In this project |
|------|-----------------|
| Program loop | Lights cycle forever: Red → Green → Yellow → Red… |
| System calls | `write` (print) and `nanosleep` (wait) |
| Registers | `rax`, `rdi`, `rsi`, `rdx` used for syscalls |
| Data section | Messages and delay times stored in `.data` |
| Control flow | `call` / `ret` for helpers, `jmp` to loop |

## How a real traffic light maps to code

```
Physical world              This program
----------------            ----------------
Red lamp ON                 Print red text, then sleep
Green lamp ON               Print green text, then sleep
Yellow lamp ON              Print yellow text, then sleep
Controller repeats          jmp .loop
```

Timing used here (easy to change in the `.data` section):

- **RED** — 3 seconds (stop)
- **GREEN** — 3 seconds (go)
- **YELLOW** — 1 second (caution)

## Requirements (Ubuntu)

```bash
sudo apt update
sudo apt install nasm binutils
```

- `nasm` — assembler (turns `.asm` into an object file)
- `ld` — linker (turns the object file into an executable)

## Build and run

```bash
# Option A: use make
make
./traffic_light

# Option B: manual commands
nasm -f elf64 traffic_light.asm -o traffic_light.o
ld traffic_light.o -o traffic_light
./traffic_light
```

Press **Ctrl+C** to stop.

## Step-by-step: what happens when you run it

1. `_start` begins (Linux entry point for assembly programs).
2. Screen is cleared with an ANSI escape sequence.
3. Title + **RED** message are printed with `sys_write`.
4. Program sleeps 3 seconds with `sys_nanosleep`.
5. Same for **GREEN**, then **YELLOW**.
6. `jmp .loop` jumps back to step 2.

## Important pieces of the code

### Printing (syscall write)

```asm
mov rax, 1      ; syscall number for write
mov rdi, 1      ; file descriptor 1 = stdout (terminal)
mov rsi, ...    ; address of the text to print
mov rdx, ...    ; how many bytes to print
syscall
```

### Waiting (syscall nanosleep)

```asm
; delay_red: dq 3, 0   means 3 seconds, 0 nanoseconds
mov rax, 35     ; syscall number for nanosleep
mov rdi, delay_red
xor rsi, rsi
syscall
```

### Colors in the terminal

ANSI codes change text color, for example:

- `ESC[1;31m` — bold red  
- `ESC[1;32m` — bold green  
- `ESC[1;33m` — bold yellow  
- `ESC[0m` — reset  

In the `.asm` file, `27` is the ESC character.

## Try these class exercises

1. Change RED to stay **5 seconds** — edit `delay_red`.
2. Swap the order to Red → Yellow → Green (some countries use that).
3. Add a fourth state: **blinking yellow** (print, short sleep, clear, short sleep, repeat a few times).
4. Build a **two-way intersection**: North–South green while East–West red, then switch.

## Clean up

```bash
make clean
```

## Files

| File | Purpose |
|------|---------|
| `traffic_light.asm` | Main assembly source (read the comments!) |
| `Makefile` | Build / clean shortcuts |
| `README.md` | This guide |
