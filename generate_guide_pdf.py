#!/usr/bin/env python3
"""Generate a shareable PDF guide for the traffic light assembly project."""

from pathlib import Path
from fpdf import FPDF

ROOT = Path(__file__).resolve().parent
ASM = (ROOT / "traffic_light.asm").read_text()
MAKEFILE = (ROOT / "Makefile").read_text()


class GuidePDF(FPDF):
    def header(self):
        if self.page_no() == 1:
            return
        self.set_font("Helvetica", "I", 9)
        self.set_text_color(100, 100, 100)
        self.cell(0, 8, "Traffic Light Control in Assembly Language - Student Guide", align="L")
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}", align="C")

    def _safe(self, text):
        # Helvetica/Courier core fonts are Latin-1 only
        replacements = {
            "\u2014": "-",  # em dash
            "\u2013": "-",  # en dash
            "\u2192": "->",
            "\u2022": "-",
            "\u2026": "...",
            "\u2018": "'",
            "\u2019": "'",
            "\u201c": '"',
            "\u201d": '"',
        }
        for src, dst in replacements.items():
            text = text.replace(src, dst)
        return text.encode("latin-1", errors="replace").decode("latin-1")

    def h1(self, text):
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "B", 18)
        self.set_text_color(20, 20, 20)
        self.multi_cell(self.epw, 10, self._safe(text))
        self.ln(2)

    def h2(self, text):
        self.ln(3)
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "B", 13)
        self.set_text_color(30, 30, 30)
        self.multi_cell(self.epw, 8, self._safe(text))
        self.ln(1)

    def h3(self, text):
        self.ln(2)
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(40, 40, 40)
        self.multi_cell(self.epw, 7, self._safe(text))
        self.ln(1)

    def body(self, text):
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "", 10)
        self.set_text_color(30, 30, 30)
        self.multi_cell(self.epw, 5.5, self._safe(text))
        self.ln(1)

    def bullet(self, text):
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "", 10)
        self.set_text_color(30, 30, 30)
        self.multi_cell(self.epw, 5.5, self._safe(f"  -  {text}"))

    def code_block(self, text):
        self.set_fill_color(245, 245, 245)
        self.set_font("Courier", "", 7.5)
        self.set_text_color(20, 20, 20)
        x = self.l_margin
        w = self.epw
        lines = text.splitlines() or [""]
        line_h = 3.8
        pad = 3
        # Render line by line with page breaks
        self.set_x(x)
        y = self.get_y()
        # Draw background in segments per page if needed
        remaining = list(lines)
        while remaining:
            space = self.page_break_trigger - self.get_y() - 2
            max_lines = max(1, int((space - pad * 2) / line_h))
            chunk = remaining[:max_lines]
            remaining = remaining[max_lines:]
            h = len(chunk) * line_h + pad * 2
            if self.get_y() + h > self.page_break_trigger and len(chunk) > 0:
                self.add_page()
            y0 = self.get_y()
            self.rect(x, y0, w, h, style="F")
            self.set_xy(x + 2, y0 + pad)
            for line in chunk:
                safe = self._safe(line.replace("\t", "    "))
                # Truncate very long lines to avoid overflow
                if len(safe) > 110:
                    safe = safe[:107] + "..."
                self.cell(w - 4, line_h, safe)
                self.ln(line_h)
                self.set_x(x + 2)
            self.set_xy(x, y0 + h + 2)


def build():
    pdf = GuidePDF(format="A4")
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.add_page()

    # Title page / intro
    pdf.set_x(pdf.l_margin)
    pdf.set_font("Helvetica", "B", 22)
    pdf.set_text_color(15, 15, 15)
    pdf.ln(8)
    pdf.multi_cell(pdf.epw, 12, "Traffic Light Control")
    pdf.set_x(pdf.l_margin)
    pdf.set_font("Helvetica", "B", 16)
    pdf.multi_cell(pdf.epw, 9, "in Assembly Language")
    pdf.ln(2)
    pdf.set_x(pdf.l_margin)
    pdf.set_font("Helvetica", "", 11)
    pdf.set_text_color(70, 70, 70)
    pdf.multi_cell(
        pdf.epw,
        6,
        "A complete beginner guide for Ubuntu Terminal (x86-64 / NASM)\n"
        "Shareable student document - theory, steps, full source code, and exercises",
    )
    pdf.ln(4)
    pdf.set_draw_color(180, 180, 180)
    pdf.line(pdf.l_margin, pdf.get_y(), pdf.l_margin + pdf.epw, pdf.get_y())
    pdf.ln(6)

    pdf.h2("1. Introduction")
    pdf.body(
        "This project shows how to design a simple traffic light controller using "
        "assembly language on Ubuntu. Instead of controlling real hardware lamps, "
        "the program simulates the lights in the terminal: it prints colored text "
        "for RED, GREEN, and YELLOW, waits for a set time, then repeats."
    )
    pdf.body(
        "This matches how a real traffic light controller works: turn on one lamp, "
        "wait, switch to the next lamp, wait, and loop forever."
    )

    pdf.h2("2. Learning objectives")
    pdf.bullet("Understand a repeating control loop (state machine idea)")
    pdf.bullet("Use Linux system calls from assembly (write and nanosleep)")
    pdf.bullet("Store messages and timing values in the .data section")
    pdf.bullet("Use registers (rax, rdi, rsi, rdx) for system call arguments")
    pdf.bullet("Build and run an assembly program with nasm and ld")
    pdf.ln(2)

    pdf.h2("3. How the traffic light maps to code")
    pdf.body("Physical world                    This program")
    pdf.code_block(
        "Red lamp ON                       Print red text, then sleep\n"
        "Green lamp ON                     Print green text, then sleep\n"
        "Yellow lamp ON                    Print yellow text, then sleep\n"
        "Controller repeats                jmp .loop"
    )
    pdf.body("Default timing used in this project:")
    pdf.bullet("RED - 3 seconds (STOP)")
    pdf.bullet("GREEN - 3 seconds (GO)")
    pdf.bullet("YELLOW - 1 second (CAUTION)")
    pdf.body("You can change these values in the .data section of traffic_light.asm.")

    pdf.h2("4. Requirements (Ubuntu)")
    pdf.body("Install the assembler and linker tools:")
    pdf.code_block(
        "sudo apt update\n"
        "sudo apt install nasm binutils"
    )
    pdf.bullet("nasm - assembler (turns .asm into an object file .o)")
    pdf.bullet("ld - linker (turns the .o file into an executable program)")

    pdf.h2("5. How to build and run")
    pdf.h3("Option A - using make")
    pdf.code_block(
        "make\n"
        "./traffic_light"
    )
    pdf.h3("Option B - manual commands")
    pdf.code_block(
        "nasm -f elf64 traffic_light.asm -o traffic_light.o\n"
        "ld traffic_light.o -o traffic_light\n"
        "./traffic_light"
    )
    pdf.body("Press Ctrl+C to stop the program.")
    pdf.body("To remove build files later:")
    pdf.code_block("make clean")

    pdf.h2("6. Step-by-step: what happens when it runs")
    pdf.bullet("1. _start begins (Linux entry point for assembly programs).")
    pdf.bullet("2. The screen is cleared using an ANSI escape sequence.")
    pdf.bullet("3. The title and RED message are printed with sys_write.")
    pdf.bullet("4. The program sleeps 3 seconds with sys_nanosleep.")
    pdf.bullet("5. The same process runs for GREEN, then YELLOW.")
    pdf.bullet("6. jmp .loop jumps back to the beginning and repeats forever.")

    pdf.add_page()
    pdf.h2("7. Important code ideas explained")

    pdf.h3("7.1 Printing to the terminal (sys_write)")
    pdf.code_block(
        "mov rax, 1      ; syscall number for write\n"
        "mov rdi, 1      ; file descriptor 1 = stdout (terminal)\n"
        "mov rsi, ...    ; address of the text to print\n"
        "mov rdx, ...    ; how many bytes to print\n"
        "syscall"
    )

    pdf.h3("7.2 Waiting / delay (sys_nanosleep)")
    pdf.code_block(
        "; delay_red: dq 3, 0   means 3 seconds, 0 nanoseconds\n"
        "mov rax, 35     ; syscall number for nanosleep\n"
        "mov rdi, delay_red\n"
        "xor rsi, rsi\n"
        "syscall"
    )

    pdf.h3("7.3 Terminal colors (ANSI escape codes)")
    pdf.body(
        "ANSI codes change text color in the terminal. In the .asm file, "
        "the number 27 is the ESC character."
    )
    pdf.bullet("ESC[1;31m - bold red")
    pdf.bullet("ESC[1;32m - bold green")
    pdf.bullet("ESC[1;33m - bold yellow")
    pdf.bullet("ESC[0m - reset color")

    pdf.h3("7.4 Program structure")
    pdf.bullet(".data section - stores messages, colors, and delay times")
    pdf.bullet(".text section - contains the instructions the CPU runs")
    pdf.bullet("print / clear_screen / sleep - small helper routines")
    pdf.bullet(".loop + jmp - keeps the traffic light cycling")

    pdf.h2("8. Project files included")
    pdf.bullet("traffic_light.asm - main assembly source code")
    pdf.bullet("Makefile - shortcuts to build, run, and clean")
    pdf.bullet("README.md - short project readme")
    pdf.bullet("Traffic_Light_Assembly_Guide.pdf - this document")

    pdf.h2("9. Full Makefile")
    pdf.code_block(MAKEFILE.strip() + "\n")

    pdf.add_page()
    pdf.h2("10. Full assembly source code (traffic_light.asm)")
    pdf.body(
        "Copy this file as traffic_light.asm, then build and run using the "
        "commands in Section 5."
    )
    # Split code into chunks so PDF pages stay readable
    asm_lines = ASM.splitlines()
    chunk_size = 55
    for i in range(0, len(asm_lines), chunk_size):
        chunk = "\n".join(asm_lines[i : i + chunk_size]) + "\n"
        pdf.code_block(chunk)

    pdf.add_page()
    pdf.h2("11. Practice exercises")
    pdf.bullet(
        "1. Change RED to stay 5 seconds by editing delay_red in the .data section."
    )
    pdf.bullet(
        "2. Change the order to Red -> Yellow -> Green (used in some countries)."
    )
    pdf.bullet(
        "3. Add a blinking yellow state (print, short sleep, clear, short sleep)."
    )
    pdf.bullet(
        "4. Design a two-way intersection: North-South green while East-West is red, then switch."
    )

    pdf.h2("12. Quick troubleshooting")
    pdf.bullet("Command 'nasm' not found -> run: sudo apt install nasm")
    pdf.bullet("Permission denied on ./traffic_light -> run: chmod +x traffic_light")
    pdf.bullet("No colors shown -> use a normal terminal (GNOME Terminal, xterm, etc.)")
    pdf.bullet("Program does not stop -> press Ctrl+C")

    pdf.h2("13. Summary")
    pdf.body(
        "A traffic light controller is a loop of states with timing. In assembly on "
        "Ubuntu, we implement that loop using print (sys_write), delay (sys_nanosleep), "
        "and jump (jmp). This document contains the full explanation and complete "
        "source so another person can follow, build, and run the project on Ubuntu."
    )

    out = ROOT / "Traffic_Light_Assembly_Guide.pdf"
    pdf.output(out)
    print(f"Wrote {out}")


if __name__ == "__main__":
    build()
