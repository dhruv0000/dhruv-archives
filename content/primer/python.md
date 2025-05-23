---
title: "Python"
date: 2025-05-21T12:14:44-04:00
draft: true
---

# What kind of language is Python?
Python is an interpreted, high-level, general-purpose programming language. It emphasizes readability with clear syntax and uses dynamic typing and automatic memory management.

# Execution and Compilation
When you run a Python script, the source code is translated into bytecode by the Python compiler, then executed by the Python virtual machine (interpreter).

Python saves compiled bytecode as `.pyc` files (typically in a `__pycache__` directory) to improve startup performance on subsequent runs. The Python interpreter:

1. Doesn't load and execute all bytecode at once
2. Instead operates line-by-line in an instruction cycle
3. Executes bytecode instructions incrementally as needed

This execution model contributes to Python's dynamic nature, allowing features like runtime modification of code and interactive debugging, though at the cost of some performance compared to fully compiled languages.

# Built-in Data Types
Python provides several built-in types:

- Numeric Types:
  - `int`        – integers
  - `float`      – floating-point numbers
  - `complex`    – complex numbers
- Sequence Types:
  - `str`        – immutable text
  - `list`       – ordered, mutable collection
  - `tuple`      – ordered, immutable collection
  - `range`      – sequence of numbers
- Mapping Type:
  - `dict`       – key/value pairs
- Set Types:
  - `set`        – unordered mutable collection
  - `frozenset`  – immutable set
- Boolean Type:
  - `bool`       – `True` or `False`
- Binary Types:
  - `bytes`      – immutable byte sequences
  - `bytearray`  – mutable byte sequences
  - `memoryview` – memory buffer interface
