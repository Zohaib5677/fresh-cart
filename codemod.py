import os
import glob

def refactor():
    files = glob.glob('src/**/*.tsx', recursive=True) + glob.glob('src/**/*.ts', recursive=True)
    for filepath in files:
        with open(filepath, 'r') as f:
            content = f.read()
        
        original = content
        
        # We replace text-white with text-foreground, etc.
        content = content.replace('text-white', 'text-foreground')
        content = content.replace('border-white', 'border-foreground')
        content = content.replace('bg-white/[', 'bg-foreground/[')
        content = content.replace('bg-white/', 'bg-foreground/')
        content = content.replace('from-white', 'from-foreground')
        content = content.replace('to-white', 'to-foreground')
        
        content = content.replace('text-black', 'text-background')
        content = content.replace('bg-black', 'bg-background')
        
        if content != original:
            with open(filepath, 'w') as f:
                f.write(content)
            print(f'Updated {filepath}')

if __name__ == '__main__':
    refactor()
