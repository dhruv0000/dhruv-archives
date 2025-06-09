---
title: "Python"
date: 2025-05-21T12:14:44-04:00
_build:
  list: local
  render: link
---

## 1 · Language Basics

### What Kind of Language Is Python?

* **Interpreted** (byte‑code via CPython), **high‑level**, **general‑purpose**.
* Dynamically typed, garbage‑collected, batteries‑included stdlib.

### Execution Model

1. **Source → Bytecode** (`.py` → `.pyc`).
2. **Bytecode → VM** (CPython eval loop).
3. Objects live on the heap; ref‑count + cyclic GC manage memory.

---

## 2 · Core Operations & Operators

| Category   | Symbols                | Notes & Gotchas                                                |                         |
| ---------- | ---------------------- | -------------------------------------------------------------- | ----------------------- |
| Arithmetic | `+ - * / // % **`      | `/` is float div, `//` floor‑div (truncates toward −∞).        |                         |
| Assignment | `= += -= *= ...`       | Operate in‑place when possible (`list += ...`).                |                         |
| Comparison | `== != < <= > >=`      | Chainable: `0 < x < 10`.                                       |                         |
| Logical    | `and or not`           | Short‑circuit evaluation.                                      |                         |
| Bitwise    | \`&                    |  ^ \~ << >>\`                                                  | Works on `int`, `bool`. |
| Identity   | `is is not`            | Compare object identity, **not** value.                        |                         |
| Membership | `in not in`            | Works on any container implementing `__contains__`.            |                         |
| Slicing    | `obj[start:stop:step]` | Omitted indices default to seq ends; negative `step` reverses. |                         |

```python
x **= 2                    # square in‑place
nums[::-1]                 # reversed copy
if (n := len(seq)) > 10:   # walrus operator (3.8+)
    ...
```

---

## 3 · Working with Collections

### 3.1 Built‑in Sequences

#### `list`

Mutable, ordered, allows duplicates.

```python
fruits = ["🍎", "🍌", "🍒"]
fruits.append("🥝")
last = fruits.pop()              # default last element
fruits.sort(key=len, reverse=True)
uniq_sorted = sorted(set(fruits))
```

#### `tuple`

Immutable, ordered, hashable if all elements hashable.

```python
pt = (3, 4)
x, y = pt
```

#### `range`

Memory‑efficient arithmetic progressions.

```python
for i in range(0, 10, 2):
    ...
```

### 3.2 Sets → `set` / `frozenset`

Unordered & unique elements.

```python
primes = {2, 3, 5, 7}
odd_primes = primes - {2}
union = primes | {11, 13}
```

### 3.3 Mappings → `dict`

Insertion‑ordered hash map.

```python
scores = {"alice": 95, "bob": 87}
for name, score in scores.items():
    ...
bonus = {k: v + 5 for k, v in scores.items() if v > 90}
```

### 3.4 The `collections` Cheatsheet

| Utility       | Purpose                     | Snippet                                  |
| ------------- | --------------------------- | ---------------------------------------- |
| `deque`       | O(1) pops/appends both ends | `dq = deque(maxlen=100)`                 |
| `defaultdict` | Auto‑initialising dict      | `hist = defaultdict(int)`                |
| `Counter`     | Multiset / frequency table  | `counts = Counter(words).most_common(3)` |
| `OrderedDict` | Dict w/ reorder ops         | `od.move_to_end(key)`                    |
| `namedtuple`  | Lightweight record struct   | `Point = namedtuple('Point', "x y")`     |

### 3.5 Iteration Patterns — The Full Toolkit

```python
# ❶ Simple for‑loop
for x in seq:
    ...

# ❷ Index + value
for idx, x in enumerate(seq, 1):
    print(idx, x)

# ❸ Parallel iteration (stop at shortest)
for a, b in zip(listA, listB):
    ...
# use itertools.zip_longest to pad →

# ❹ Reverse, sorted, and slices
for x in reversed(seq):
    ...
for x in sorted(seq, key=str.lower):
    ...

# ❺ Dict views
for k, v in mapping.items():
    ...

# ❻ Sentinel‑controlled iteration
with open('data') as f:
    for line in iter(f.readline, ''):   # until EOF
        ...

# ❼ Generator / comprehension (lazy)
squares = (n*n for n in range(10))

# ❽ itertools power‑ups
from itertools import chain, islice, cycle, groupby
flat = chain.from_iterable(lol)    # flatten
first5 = list(islice(gen, 5))
```

> **Remember:** `for … else:` runs the `else` block **only** if the loop *was not broken* by `break`.

### 3.6 Shallow vs Deep Copy

| Copy Type   | How                                           | What’s Copied             | Nested Mutables?                           |
| ----------- | --------------------------------------------- | ------------------------- | ------------------------------------------ |
| **Shallow** | `obj.copy()`, slice (`lst[:]`), `copy.copy()` | Container *structure*     | **Shared** between copies (one level only) |
| **Deep**    | `copy.deepcopy(obj)`                          | Entire graph, recursively | **Duplicated**; mutate safely              |

```python
import copy
nested = [[1, 2], [3, 4]]
shallow = nested.copy()      # or list(nested)
deep    = copy.deepcopy(nested)

nested[0][0] = 99            # mutate inner list
print(shallow[0][0])  # 99  ← affected (shared inner list)
print(deep[0][0])     # 1   ← independent copy
```

*Custom classes* can control both behaviours via `__copy__` and `__deepcopy__` hooks.

### 3.7 Common Pitfalls

* Mutable default args (`def f(x, cache=[]): …`). Use `None` sentinel.
* Exhausted generators cannot be re‑iterated; recreate if needed.
* Dict view objects (`dict.keys()`) update live — cast to `list` for snapshot.

---

## 4 · Idiomatic Recipes

### 4.1 Flatten a List‑of‑Lists

```python
lol = [[1, 2], [3, 4, 5]]
# List‑comprehension (fast & readable)
flat = [x for sub in lol for x in sub]

# itertools alternative – streams huge data lazily
from itertools import chain
flat_iter = chain.from_iterable(lol)     # returns an iterator
```

*Avoid* `sum(lol, [])`: it copies on each addition (O(n²)).

### 4.2 Deduplicate **and** Preserve Order

```python
seq = [3, 1, 2, 3, 2, 4]
uniq = list(dict.fromkeys(seq))          # Python ≥3.7
# → [3, 1, 2, 4]

# Back‑port compatible / explicit version
seen, uniq = set(), []
for x in seq:
    if x not in seen:
        seen.add(x)
        uniq.append(x)
```

*Runs in O(n)*, keeps first occurrence, preserves original ordering.

### 4.3 Misc One‑Liners

* Swap 2 vars: `a, b = b, a`.
* Percentage diff: `diff = (b‑a)/a*100`.
* FizzBuzz in one line for fun:

```python
print(["FizzBuzz" if i%15==0 else "Fizz" if i%3==0 else "Buzz" if i%5==0 else i for i in range(1,101)])
```

---

## 5 · Next Steps

* Dive into **itertools**, **functools**, **heapq**, **bisect** for efficient algorithms.
* Bookmark the official [Python Tutorial](https://docs.python.org/3/tutorial/index.html).

> **Pro‑Tip:** Keep an IPython or Jupyter REPL handy — experimentation is the fastest teacher.

---

## 6 · Object‑Oriented Programming (OOP)

### 6.0 Why OOP?

Python’s object model lets you bundle **state** (attributes) with **behaviour** (methods) and build reusable abstractions. OOP enables clean APIs, polymorphism, and clear separation of concerns.

### 6.1 Defining a Class & Creating Instances

```python
class Dog:
    # class attribute → shared by all instances
    species = "Canis lupus"

    def __init__(self, name: str, age: int):
        self.name = name            # instance attributes
        self.age = age

    def bark(self) -> str:
        return f"{self.name} says woof!"

    def __repr__(self):            # debug‑friendly
        return f"Dog({self.name!r}, {self.age})"

rex = Dog("Rex", 5)
print(rex.bark())           # Rex says woof!
```

* `__init__`() initialises a **newly created** object.
* `self` is just a naming convention for the **receiver**.

### 6.2 Instance vs. Class Attributes

| Attribute Kind | Resolution Order | Typical Use                                  |
| -------------- | ---------------- | -------------------------------------------- |
| **Class**      | `Dog.species`    | Constants shared by all instances.           |
| **Instance**   | `rex.name`       | Per‑object state (stored in `obj.__dict__`). |

> Attribute lookup order = instance → class → base classes (MRO).

### 6.3 Special / “Dunder” Methods

Implement the data‑model hooks to integrate with built‑ins:

| Method                  | Purpose                          | Example                 |
| ----------------------- | -------------------------------- | ----------------------- |
| `__str__`               | Human‑readable string            | `str(obj)`              |
| `__repr__`              | Unambiguous developer repr       | `print(obj!r)`          |
| `__len__`               | Length support                   | `len(container)`        |
| `__iter__` / `__next__` | Iterator protocol                | `for x in obj:`         |
| `__getitem__`           | Subscription / slicing           | `obj[i]`, `obj[a:b]`    |
| `__eq__`, `__lt__`, …   | Rich comparisons                 | `obj1 == obj2`          |
| `__hash__`              | Hashability (`set` / `dict` key) | depends on immutability |
| `__enter__`, `__exit__` | Context manager                  | `with obj:`             |

### 6.4 Inheritance & `super()`

```python
class Animal:
    def speak(self):
        raise NotImplementedError

class Cat(Animal):
    def __init__(self, name):
        super().__init__()  # delegate up the MRO (even if empty)
        self.name = name

    def speak(self):
        return f"{self.name} meows"
```

*Overrides* replace base methods; call `super()` to extend.

### 6.5 Multiple Inheritance & MRO

Python uses **C3 linearisation** to compute a single consistent Method Resolution Order.

```python
class Flyer:
    def skill(self):
        return "fly"

class Swimmer:
    def skill(self):
        return "swim"

class Duck(Flyer, Swimmer):
    pass

print(Duck().skill())  # → "fly" (Flyer first in MRO)
```

Use **mixins** (small, orthogonal bases) to add capabilities.

### 6.6 Composition over Inheritance

Prefer *has‑a* relationships when behaviour is not naturally hierarchical:

```python
class Engine:
    def start(self):
        ...

class Car:
    def __init__(self):
        self.engine = Engine()  # composed component
```

### 6.7 Encapsulation & Properties

* Leading underscore `_name`: soft *protected* convention.
* Double underscore `__name`: name‑mangled → `_Class__name`.
* Use `@property` to expose computed attributes while keeping internal details hidden.

```python
class Celsius:
    def __init__(self, temp=0):
        self._temp = temp

    @property
    def temperature(self):
        """Get temperature in °C"""
        return self._temp

    @temperature.setter
    def temperature(self, value):
        if value < -273.15:
            raise ValueError("Below absolute zero!")
        self._temp = value
```

### 6.8 Data Classes & `__slots__`

```python
from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float
    label: str = "origin"
```

* Automatically adds `__init__`, `__repr__`, `__eq__`, etc.
* `__slots__ = ('x', 'y')` removes per‑instance `__dict__`, saving memory.

### 6.9 Abstract Base Classes (ABCs) & Protocols

```python
from abc import ABC, abstractmethod

class Drawable(ABC):
    @abstractmethod
    def draw(self):
        ...
```

*ABCs* enforce required interface; cannot instantiate until all abstract methods implemented.

```python
from typing import Protocol

class SupportsClose(Protocol):
    def close(self) -> None: ...
```

*Protocols* provide **structural typing** (duck typing with type‑checker support).

### 6.10 Operator Overloading

```python
class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)
    def __repr__(self):
        return f"Vector({self.x}, {self.y})"
```

### 6.11 Metaprogramming (Descriptors & Metaclasses)

* **Descriptor** = object with `__get__`, `__set__`, `__delete__` controlling attribute access (e.g., `property`).
* **Metaclass** = “class of a class” controlling class creation. Rarely needed beyond ORMs & frameworks.

```python
class MetaLogging(type):
    def __new__(mcls, name, bases, ns):
        print(f"Creating {name}")
        return super().__new__(mcls, name, bases, ns)

class Logged(metaclass=MetaLogging):
    pass
```

### 6.12 Common OOP Pitfalls

* Forgetting `self` parameter in instance methods.
* Mutable default arguments in `__init__` (use `None` + assign).
* Calling `super()` with wrong arguments in multiple inheritance.
* Overusing inheritance when simple composition suffices.
* Not implementing `__hash__` when overriding `__eq__` → objects become unhashable.

---

📌 **Cheat‑Sheet Recap**

| Goal                               | Idiomatic Solution                                       |
| ---------------------------------- | -------------------------------------------------------- |
| Create simple data container       | `@dataclass`                                             |
| Control attribute read/write       | `@property` or custom descriptor                         |
| Share behaviour across classes     | Mixins (`class FooMixin: ...`)                           |
| Custom constructor logic           | Override `__init__`, call `super()`                      |
| Provide rich comparisons           | Implement `__eq__`, `__lt__`, `functools.total_ordering` |
| Ensure subclasses override methods | ABC + `@abstractmethod`                                  |

> **TL;DR:** Start simple—define clear classes, favour composition, sprinkle in dunder methods and ABCs only when they add value. Keep your public API small and cohesive.
