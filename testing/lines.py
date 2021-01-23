import os.path
import os
total_line = 0

for dirpath, dirnames, filenames in os.walk(".\src"):
    for filename in [f for f in filenames]:
        full_path = os.path.join(dirpath, filename)
        print(full_path)
        num_lines = sum(1 for _ in open(full_path, encoding="utf8"))
        total_line = total_line + num_lines

print(total_line)
