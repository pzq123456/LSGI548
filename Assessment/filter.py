import re
import subprocess
import os

def extract_images(md_content):
    """Extract images"""
    images = []
    pattern = r"!\[(.*?)\]\((.*?)\)"
    matches = re.findall(pattern, md_content)
    for title, _ in matches:
        images.append(title)
    return images

def extract_equations(md_content):
    """Extract equations"""
    equations = []
    pattern = r"\\begin{equation}(.*?)\\end{equation}"
    matches = re.findall(pattern, md_content, re.DOTALL)
    for i, eq in enumerate(matches):
        equations.append(f"Equation {i+1}: {eq.strip()}")
    return equations

def generate_tables(images, equations):
    """Generate image and equation tables"""
    toc_str = ""

    toc_str += "## Image Table\n\n"
    toc_str += "| No. | Title | Page |\n| --- | ----- | ---- |\n"
    for i, title in enumerate(images):
        toc_str += f"| {i+1} | {title} | {{image_page_{i+1}}} |\n"

    toc_str += "\n## Equation Table\n\n"
    toc_str += "| No. | Equation | Page |\n| --- | -------- | ---- |\n"
    for i, eq in enumerate(equations):
        toc_str += f"| {i+1} | {eq} | {{equation_page_{i+1}}} |\n"

    return toc_str

def main():
    PATH = os.path.dirname(os.path.abspath(__file__))

    # Read the Markdown file
    with open(os.path.join(PATH,"report.md"), "r", encoding="utf-8") as f:
        md_content = f.read()

    # Extract content
    images = extract_images(md_content)
    equations = extract_equations(md_content)

    # Generate tables
    toc_str = generate_tables(images, equations)

    # Write the updated content to the file
    with open("report_with_toc.md", "w", encoding="utf-8") as f:
        f.write(toc_str + "\n\n" + md_content)

if __name__ == "__main__":
    main()
