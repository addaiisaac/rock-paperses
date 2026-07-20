# Traffic light control - build helpers

ASM = nasm
LD  = ld

TARGET = traffic_light
SRC    = traffic_light.asm
OBJ    = traffic_light.o

.PHONY: all clean run

all: $(TARGET)

$(TARGET): $(OBJ)
	$(LD) $(OBJ) -o $(TARGET)

$(OBJ): $(SRC)
	$(ASM) -f elf64 $(SRC) -o $(OBJ)

run: $(TARGET)
	./$(TARGET)

clean:
	rm -f $(OBJ) $(TARGET)
