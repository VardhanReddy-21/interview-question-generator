/**
 * Comprehensive Knowledge Base of Interview Questions & Answers
 * Full coverage for: C, Python, Java, SQL, MySQL, C++, HTML, CSS, JavaScript, Node.js, React, and Data Structures (DS)
 */

const TOPICS = [
  { id: "all", name: "All Topics", icon: "🌐", description: "Comprehensive library across all 12 disciplines and specializations", color: "#6366f1" },
  { id: "c", name: "C Programming", icon: "⚙️", description: "Pointers, memory management (malloc/free), struct padding, volatile, stack vs heap", color: "#3b82f6" },
  { id: "cpp", name: "C++", icon: "🚀", description: "OOP, vtables, smart pointers (unique/shared), RAII, templates, STL, move semantics", color: "#6366f1" },
  { id: "python", name: "Python", icon: "🐍", description: "GIL, generators, decorators, memory management, asyncio, multiprocessing, list comprehensions", color: "#f59e0b" },
  { id: "java", name: "Java", icon: "☕", description: "JVM internals, Garbage Collection, multithreading, HashMap internals, equals/hashCode, OOP", color: "#ef4444" },
  { id: "sql", name: "SQL", icon: "🗄️", description: "Joins, aggregations, HAVING vs WHERE, indexing (B-Trees), normalization, ACID transactions", color: "#06b6d4" },
  { id: "mysql", name: "MySQL", icon: "🐬", description: "InnoDB vs MyISAM, EXPLAIN execution plans, indexing strategies, transactions, replication, deadlocks", color: "#f97316" },
  { id: "html", name: "HTML", icon: "🌐", description: "Semantic HTML5, Web Accessibility (a11y/WCAG), async/defer scripts, Web Storage, forms", color: "#ea580c" },
  { id: "css", name: "CSS", icon: "🎨", description: "Box Model, Flexbox vs Grid, specificity, responsive design, clamp, media queries, animations", color: "#0284c7" },
  { id: "javascript", name: "JavaScript", icon: "⚡", description: "Event Loop, closures, promises, async/await, prototypes, ES6+, debouncing/throttling", color: "#eab308" },
  { id: "nodejs", name: "Node.js", icon: "🟢", description: "Event-driven I/O, libuv thread pool, Streams & Buffers, Express middleware, clustering", color: "#10b981" },
  { id: "react", name: "React", icon: "⚛️", description: "Virtual DOM, Hooks (useEffect, useMemo, useCallback), Context vs Redux, lifecycle, state", color: "#06b6d4" },
  { id: "ds", name: "Data Structures (DS)", icon: "🧩", description: "Arrays, Linked Lists, Stacks, Queues, Trees, Hash Tables, Graphs, Heaps, Big-O Complexity", color: "#8b5cf6" }
];

const QUESTION_BANK = [
  // ==========================================
  // 1. C PROGRAMMING
  // ==========================================
  {
    id: "c-01",
    topic: "c",
    topicName: "C Programming",
    role: "Embedded / Systems / C Developer",
    category: "technical",
    difficulty: "easy",
    experienceLevel: "entry",
    question: "What is the difference between malloc(), calloc(), realloc(), and free() in C, and what causes a memory leak?",
    modelAnswer: `In C, dynamic memory is allocated from the **heap** at runtime:

1. **malloc(size_t size):** Allocates a contiguous block of specified bytes. It does **not** initialize memory, leaving random indeterminate values (garbage data).
2. **calloc(size_t num, size_t size):** Allocates memory for an array of elements, multiplies count by size, and explicitly initializes all bytes to **zero**.
3. **realloc(void *ptr, size_t new_size):** Resizes an existing heap allocation. It expands in-place or allocates a new block, copies existing contents, frees the old block, and returns the new pointer.
4. **free(void *ptr):** Releases allocated heap memory back to the operating system's heap allocator.

**Memory Leak:** Occurs when heap memory is allocated but never released via \`free()\` before all pointers pointing to that address are overwritten or go out of scope. The memory remains reserved until the process terminates.`,
    interviewerIntent: "Validates foundational heap memory management, memory safety awareness, and avoidance of garbage values or leaks in C.",
    answerBlueprint: "1) Define heap vs stack. 2) Compare malloc (uninitialized) vs calloc (zeroed). 3) Explain realloc behavior. 4) Detail free() and explain how losing pointer references causes memory leaks. 5) Mention dangling pointers.",
    codeSnippet: `// Proper Allocation and Safe Freeing in C
int *arr = (int *)malloc(5 * sizeof(int));
if (arr == NULL) {
    perror("Allocation failed");
    return 1;
}

// Reallocate if more space is needed
int *temp = (int *)realloc(arr, 10 * sizeof(int));
if (temp != NULL) {
    arr = temp;
}

// Always free and nullify pointer to prevent dangling pointer
free(arr);
arr = NULL;`,
    complexity: "Time: O(1) allocation/deallocation on average | Space: O(N) bytes on Heap",
    commonMistakes: "Forgetting to check if malloc returned NULL; using memory after freeing it (use-after-free); freeing the same pointer twice (double free).",
    followUpQuestions: [
      "What is a dangling pointer and how does setting the pointer to NULL prevent issues?",
      "What happens if realloc() fails to allocate memory?"
    ],
    tags: ["C", "Pointers", "Memory Management", "Heap", "Core CS"]
  },
  {
    id: "c-02",
    topic: "c",
    topicName: "C Programming",
    role: "C / Systems Engineer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "What is a pointer in C, how does pointer arithmetic work, and what is the significance of the 'volatile' keyword?",
    modelAnswer: `A **pointer** is a variable that stores the memory address of another variable.

**Pointer Arithmetic:**
Pointer arithmetic is scaled automatically by the byte-size of the data type it points to:
- If \`int *p\` points to address \`0x1000\` and \`sizeof(int) == 4\`, then \`p + 1\` evaluates to address \`0x1004\` (not \`0x1001\`).
- Subtracting two pointers of the same type yields the number of elements between them (of type \`ptrdiff_t\`).

**The 'volatile' Keyword:**
The \`volatile\` qualifier tells the C compiler that a variable's value may be changed at any time by something outside the program's immediate code (such as a hardware register, an interrupt service routine (ISR), or another concurrent thread).
**Effect:** Prevents the compiler's optimizer from caching the variable in a CPU register or omitting reads/writes it assumes are redundant.`,
    interviewerIntent: "Tests core understanding of low-level memory addressing, compiler optimization behavior, and hardware/concurrency considerations.",
    answerBlueprint: "Explain pointer definition, memory addresses, scale factor based on sizeof(type), and give real-world use cases for volatile (hardware registers, ISR flags).",
    codeSnippet: `// 1. Pointer Arithmetic
int numbers[3] = {10, 20, 30};
int *ptr = numbers; // points to numbers[0]
printf("%d\\n", *(ptr + 1)); // prints 20 (scaled by sizeof(int))

// 2. Volatile in embedded/hardware register
volatile uint32_t *const STATUS_REG = (uint32_t *)0x40001000;
while ((*STATUS_REG & 0x01) == 0) {
    // Compiler will NOT optimize out this loop into a register cache!
}`,
    complexity: "Time: O(1) memory access | Space: 4 bytes (32-bit architecture) or 8 bytes (64-bit architecture)",
    commonMistakes: "Assuming ptr + 1 adds 1 byte instead of sizeof(*ptr) bytes; declaring pointer to volatile instead of volatile pointer.",
    followUpQuestions: [
      "What is the difference between const int *ptr, int *const ptr, and const int *const ptr?",
      "Can a variable be both const and volatile?"
    ],
    tags: ["C", "Pointers", "Memory", "Volatile", "Compilers"]
  },
  {
    id: "c-03",
    topic: "c",
    topicName: "C Programming",
    role: "Embedded / Systems / C Developer",
    category: "technical",
    difficulty: "hard",
    experienceLevel: "mid",
    question: "What causes a Segmentation Fault (SIGSEGV) in C, and what is structure padding/alignment?",
    modelAnswer: `A **Segmentation Fault (SIGSEGV)** occurs when a program attempts to access a restricted memory segment or an invalid memory address that the OS has not mapped for that process.

**Common Causes of Segfaults:**
1. Dereferencing a NULL pointer (\`int *p = NULL; *p = 5;\`).
2. Dereferencing an uninitialized or dangling pointer.
3. Buffer overflows corrupting the return address on the stack.
4. Writing to read-only memory (e.g., modifying string literals: \`char *str = "hello"; str[0] = 'H';\`).
5. Stack overflow from infinite recursion.

**Structure Padding and Alignment:**
Modern CPUs read memory in 4-byte or 8-byte word boundaries for hardware efficiency. Compilers insert empty bytes (**padding**) between struct members to ensure each member aligns to a memory address divisible by its size.
- For example, \`struct { char a; int b; }\` takes 8 bytes (1 byte char + 3 padding bytes + 4 bytes int), not 5 bytes.
- Packing attributes (\`#pragma pack(1)\` or \`__attribute__((packed))\`) eliminate padding at the cost of slower unaligned memory accesses.`,
    interviewerIntent: "Assesses deep systems-level knowledge of memory protection, OS signals, CPU word boundaries, and struct layout.",
    answerBlueprint: "List 4-5 causes of segfaults with code triggers. Explain CPU word alignment, show struct padding with byte counts, and discuss #pragma pack.",
    codeSnippet: `// Structure Padding Example
struct Unoptimized {
    char a;    // 1 byte
    // 3 bytes padding inserted by compiler
    int b;     // 4 bytes
    char c;    // 1 byte
    // 3 bytes padding inserted
}; // Total size: 12 bytes!

struct Optimized {
    int b;     // 4 bytes
    char a;    // 1 byte
    char c;    // 1 byte
    // 2 bytes padding at end
}; // Total size: 8 bytes (33% memory saved!)`,
    complexity: "Structure alignment directly impacts cache line utilization (L1/L2 cache hit rate).",
    commonMistakes: "Assuming struct size is simply the sum of its field sizes; writing to string literals allocated in .rodata.",
    followUpQuestions: [
      "How do you debug a segmentation fault using gdb and core dumps?",
      "What is the difference between stack overflow and heap corruption?"
    ],
    tags: ["C", "Segfault", "Struct Padding", "Memory Alignment", "Architecture"]
  },

  // ==========================================
  // 2. C++
  // ==========================================
  {
    id: "cpp-01",
    topic: "cpp",
    topicName: "C++",
    role: "C++ Software Engineer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "What are Smart Pointers in modern C++ (unique_ptr, shared_ptr, weak_ptr), and how do they enforce RAII?",
    modelAnswer: `Smart pointers in modern C++ (C++11+) are template classes that wrap raw pointers to provide **automatic memory management** through the **RAII (Resource Acquisition Is Initialization)** idiom: memory is acquired in the constructor and automatically freed in the destructor when the smart pointer leaves scope.

1. **std::unique_ptr:**
   - Enforces **exclusive ownership**. Only one unique_ptr can own the managed object at any time.
   - Non-copyable (copy constructor is deleted), but **movable** via \`std::move()\`.
   - Zero runtime overhead compared to a raw pointer.

2. **std::shared_ptr:**
   - Enforces **shared reference-counted ownership**.
   - Maintains an internal control block with a reference count. Each copy increments the count; when a shared_ptr is destroyed, count decrements. When count hits zero, the underlying resource is deleted.

3. **std::weak_ptr:**
   - Provides a **non-owning observer** reference to an object managed by a \`shared_ptr\`.
   - Does not increment the reference count.
   - Prevents **circular reference memory leaks** (e.g. Node A references Node B and Node B references Node A). Must be converted to \`shared_ptr\` via \`lock()\` before accessing.`,
    interviewerIntent: "Tests adherence to modern C++ best practices, memory safety without garbage collection, and understanding of ownership semantics.",
    answerBlueprint: "Explain RAII principle. Compare unique_ptr (exclusive, move-only, zero cost) vs shared_ptr (reference counting) vs weak_ptr (breaking circular dependencies).",
    codeSnippet: `#include <iostream>
#include <memory>

class Resource {
public:
    Resource() { std::cout << "Acquired\\n"; }
    ~Resource() { std::cout << "Destroyed automatically\\n"; }
};

int main() {
    // 1. unique_ptr (Preferred by default)
    auto uPtr = std::make_unique<Resource>();
    // std::unique_ptr<Resource> copy = uPtr; // COMPILE ERROR: Cannot copy!
    auto moved = std::move(uPtr); // Valid: ownership transferred

    // 2. shared_ptr & weak_ptr
    std::shared_ptr<Resource> sPtr1 = std::make_shared<Resource>();
    std::weak_ptr<Resource> wPtr = sPtr1; // Non-owning reference

    if (auto locked = wPtr.lock()) {
        std::cout << "Resource is alive, ref count: " << locked.use_count() << "\\n";
    }
    return 0; // All resources automatically freed here!
}`,
    complexity: "unique_ptr: Zero overhead (O(1)) | shared_ptr: O(1) with atomic reference counter overhead",
    commonMistakes: "Using shared_ptr everywhere when unique_ptr would suffice; causing circular reference memory leaks by having two shared_ptrs point to each other.",
    followUpQuestions: [
      "Why is std::make_unique and std::make_shared preferred over new?",
      "What is the difference between move semantics and copy semantics?"
    ],
    tags: ["C++", "Smart Pointers", "RAII", "Memory Management", "Modern C++"]
  },
  {
    id: "cpp-02",
    topic: "cpp",
    topicName: "C++",
    role: "C++ Software Engineer",
    category: "technical",
    difficulty: "hard",
    experienceLevel: "mid",
    question: "How does runtime polymorphism work under the hood in C++ using vtable and vptr?",
    modelAnswer: `Runtime polymorphism (dynamic dispatch) in C++ allows a base class pointer or reference to invoke an overridden method in a derived class at runtime. It is implemented using **Virtual Tables (vtables)** and **Virtual Pointers (vptrs)**:

1. **vtable (Virtual Table):** A static array of function pointers created by the compiler for each class containing at least one \`virtual\` function. Each entry points to the most-derived implementation of the virtual method.
2. **vptr (Virtual Pointer):** A hidden pointer inserted by the compiler as the first member of every object instance of a class with virtual functions.
3. **Dispatch Mechanism at Runtime:**
   - When calling \`basePtr->virtualMethod()\`, the program:
     1. Dereferences \`basePtr\` to access the object's hidden \`vptr\`.
     2. Follows \`vptr\` to the corresponding class \`vtable\`.
     3. Indexes into the vtable at compile-time determined offset to get the target function pointer.
     4. Executes the function pointer passing \`this\` as the first argument.

**Virtual Destructors:** If a class has virtual functions and is deleted through a base pointer, its destructor **must be declared virtual**; otherwise, only the base destructor runs, causing resource leaks.`,
    interviewerIntent: "Differentiates surface-level OOP knowledge from deep assembly/compiler-level mechanics of dynamic dispatch in C++.",
    answerBlueprint: "1) Define vtable (class-level array of function pointers). 2) Define vptr (per-object pointer to vtable). 3) Walk step-by-step through runtime invocation. 4) Explain why virtual destructors are mandatory.",
    codeSnippet: `class Base {
public:
    virtual void speak() { std::cout << "Base\\n"; }
    virtual ~Base() {} // Essential virtual destructor!
};

class Derived : public Base {
public:
    void speak() override { std::cout << "Derived\\n"; }
};

int main() {
    Base *ptr = new Derived();
    ptr->speak(); // Invokes vptr -> Derived vtable -> Derived::speak()
    delete ptr;   // Properly calls Derived destructor then Base destructor
}`,
    complexity: "Invocation: One extra pointer dereference (negligible O(1) overhead) | Space: sizeof(pointer) per object instance for vptr",
    commonMistakes: "Forgetting virtual destructors in polymorphic base classes; calling virtual functions inside constructors (polymorphism does not work in constructors).",
    followUpQuestions: [
      "Why should you never call virtual functions in constructors or destructors in C++?",
      "What is a pure virtual function and an abstract class?"
    ],
    tags: ["C++", "Polymorphism", "vtable", "OOP", "Compilers"]
  },

  // ==========================================
  // 3. PYTHON
  // ==========================================
  {
    id: "py-01",
    topic: "python",
    topicName: "Python",
    role: "Python / Backend Engineer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "What is the Global Interpreter Lock (GIL) in CPython, and how do you achieve true parallelism in Python?",
    modelAnswer: `The **Global Interpreter Lock (GIL)** is a mutual exclusion lock (mutex) used by CPython (the standard reference implementation of Python) to prevent multiple native OS threads from executing Python bytecodes simultaneously.

**Why it exists:**
CPython uses **reference counting** for memory management. Without the GIL, concurrent threads would race to increment and decrement reference counts, risking memory leaks or premature deallocation of live objects.

**Impact & Parallelism Strategy:**
1. **CPU-Bound Tasks (e.g. data crunching, image processing, model training):** Multi-threading provides NO speedup due to thread contention for the GIL. Use the \`multiprocessing\` module, \`concurrent.futures.ProcessPoolExecutor\`, or C extensions (NumPy/Cython) that release the GIL.
2. **I/O-Bound Tasks (e.g. API requests, web scraping, database queries):** Multi-threading (\`threading\`) or asynchronous event loops (\`asyncio\`) are highly effective because CPython automatically releases the GIL while waiting for OS I/O operations.`,
    interviewerIntent: "Tests core understanding of Python's runtime memory management, concurrency models, and architectural scaling choices.",
    answerBlueprint: "Define GIL as a mutex in CPython. Explain reference counting protection. Contrast CPU-bound (use multiprocessing) vs I/O-bound (use threading/asyncio). Mention free-threading in Python 3.13.",
    codeSnippet: `import time
from multiprocessing import Pool
import concurrent.futures

# CPU-Bound: Use Multiprocessing to bypass GIL
def heavy_computation(x):
    return sum(i * i for i in range(x))

if __name__ == '__main__':
    with Pool(processes=4) as pool:
        results = pool.map(heavy_computation, [10_000_000, 10_000_000, 10_000_000, 10_000_000])
    print("Computed parallel across 4 CPU cores:", len(results))`,
    complexity: "Threading: 1 core active at a time for Python bytecode | Multiprocessing: N cores parallel across separate memory spaces",
    commonMistakes: "Using threading for CPU-heavy tasks expecting a speedup; assuming the GIL makes Python code thread-safe (race conditions still occur at Python level).",
    followUpQuestions: [
      "Does the GIL make shared data structures like dictionaries thread-safe in Python?",
      "What is PEP 703 and experimental free-threaded Python in 3.13?"
    ],
    tags: ["Python", "GIL", "Concurrency", "Multiprocessing", "Performance"]
  },
  {
    id: "py-02",
    topic: "python",
    topicName: "Python",
    role: "Python Developer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "entry",
    question: "What are Python Generators and the 'yield' keyword, and how do they differ from regular functions?",
    modelAnswer: `A **Generator** is a special type of function that returns an iterator object. Instead of returning a single value and terminating (\`return\`), a generator produces a sequence of values lazily over time using the \`yield\` keyword.

**Key Differences:**
1. **State Preservation:** When a function hits \`yield\`, execution pauses, local variable state and execution point are saved on the stack/frame, and the yielded value is sent to the caller. On the next \`next()\` call, execution resumes immediately after the \`yield\`.
2. **Memory Efficiency (Lazy Evaluation):** Regular functions generate entire datasets in memory (e.g. creating a list of 10 million integers requires ~80MB+ RAM). A generator computes values on-the-fly one by one, using **O(1) constant memory**.
3. **Infinite Sequences:** Generators can represent infinite streams (e.g. reading streaming server logs or infinite Fibonacci sequences) without crashing system memory.`,
    interviewerIntent: "Checks knowledge of memory profiling, lazy evaluation, Python iterators, and streaming large datasets in production.",
    answerBlueprint: "Explain yield vs return. Highlight lazy evaluation and state preservation. Detail O(1) memory footprint vs O(N) list comprehension.",
    codeSnippet: `import sys

# 1. Memory Comparison
list_data = [x * 2 for x in range(1_000_000)] # Eager: allocates entire list
gen_data = (x * 2 for x in range(1_000_000))  # Lazy: generator expression

print(f"List Size: {sys.getsizeof(list_data)} bytes") # ~8.4 MB
print(f"Gen Size:  {sys.getsizeof(gen_data)} bytes")  # ~200 bytes (O(1) memory!)

# 2. Generator Function for Streaming Large Log Files
def stream_large_file(file_path):
    with open(file_path, 'r') as f:
        for line in f:
            if "ERROR" in line:
                yield line.strip()`,
    complexity: "Time: O(1) per step generation | Space: O(1) constant memory",
    commonMistakes: "Attempting to index into a generator (e.g. gen[0] throws TypeError); trying to reuse an exhausted generator.",
    followUpQuestions: [
      "What is the difference between an Iterable and an Iterator in Python?",
      "How do send(), throw(), and close() methods work with Python coroutines/generators?"
    ],
    tags: ["Python", "Generators", "Iterators", "Memory", "Performance"]
  },
  {
    id: "py-03",
    topic: "python",
    topicName: "Python",
    role: "Python Developer",
    category: "technical",
    difficulty: "hard",
    experienceLevel: "mid",
    question: "How do Python Decorators work under the hood, and why is mutable default arguments (e.g. def foo(x=[])) dangerous?",
    modelAnswer: `**Python Decorators:**
A decorator is a design pattern that allows modifying or extending the behavior of a function or class without permanently changing its source code. In Python, functions are **first-class citizens** (they can be passed as arguments, assigned to variables, and returned from functions).
- The \`@my_decorator\` syntax is syntactic sugar for: \`my_func = my_decorator(my_func)\`.
- Using \`@functools.wraps(func)\` preserves the original function's name and docstring.

**The Mutable Default Argument Trap:**
In Python, default arguments are evaluated **only once when the function definition is executed at module load time**, NOT each time the function is called.
- If a mutable object (like \`[]\` or \`{}\`) is used as a default, that exact same object is shared across every subsequent function call.
- **Fix:** Always use \`None\` as the default and initialize the mutable object inside the function body.`,
    interviewerIntent: "Assesses functional programming understanding, metaprogramming in Python, and avoidance of classic Python Gotchas.",
    answerBlueprint: "1) Explain first-class functions and decorator syntactic sugar. 2) Provide a working timing/logging decorator with @wraps. 3) Explain when default arguments are evaluated (at definition time) and the None pattern fix.",
    codeSnippet: `import functools
import time

# 1. Production-Ready Timing Decorator
def measure_time(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        duration = time.perf_counter() - start
        print(f"[{func.__name__}] executed in {duration:.4f}s")
        return result
    return wrapper

# 2. The Mutable Default Fix
# BAD: def append_item(val, items=[]) -> items persists across calls!
# GOOD:
def append_item(val, items=None):
    if items is None:
        items = []
    items.append(val)
    return items`,
    complexity: "Decorator adds minimal function call wrapper overhead | Space: O(1)",
    commonMistakes: "Omitting @functools.wraps which overwrites the decorated function's __name__ with 'wrapper'; using empty list as default argument.",
    followUpQuestions: [
      "How do you write a decorator that accepts its own configuration arguments (e.g., @retry(times=3))?",
      "What is the difference between *args and **kwargs in Python function definitions?"
    ],
    tags: ["Python", "Decorators", "Closures", "Best Practices", "Architecture"]
  },

  // ==========================================
  // 4. JAVA
  // ==========================================
  {
    id: "java-01",
    topic: "java",
    topicName: "Java",
    role: "Java / Backend Engineer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "How does HashMap work internally in Java, and why must you override hashCode() whenever overriding equals()?",
    modelAnswer: `In Java, **HashMap** operates on the principle of **hashing** using an array of \`Node<K, V>\` buckets:

**Internal Working:**
1. **Put Operation:** When \`map.put(key, value)\` is called:
   - Java calculates \`hash(key)\` and computes the bucket index: \`index = (n - 1) & hash\`.
   - If the bucket is empty, a new Node is inserted.
   - If a collision occurs (another key maps to the same bucket index), Java compares keys using \`key.equals(existingKey)\`. If equal, value is overwritten; if not equal, it is chained as a **Linked List**.
   - **Java 8 Optimization:** When a single bucket's collision chain exceeds **TREEIFY_THRESHOLD (8 items)** and total capacity is at least 64, the linked list converts into a **Red-Black Tree** (\`TreeNode\`), improving worst-case search from **O(n)** to **O(log n)**.

**The equals() and hashCode() Contract:**
- If two objects are equal according to \`equals()\`, they **MUST have the exact same \`hashCode()\`**.
- If you override \`equals()\` without overriding \`hashCode()\`, two logically equal objects will produce different hash codes and land in different buckets. \`map.get(key)\` will return \`null\` even though the key is present in the map!`,
    interviewerIntent: "A universal core Java interview question testing data structures, hashing, collision resolution, and object equality contracts.",
    answerBlueprint: "Explain bucket indexing using bitwise AND, collision resolution via chaining, Java 8 Red-Black Tree upgrade, and the equals/hashCode contract.",
    codeSnippet: `public class Employee {
    private int id;
    private String name;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Employee employee = (Employee) o;
        return id == employee.id && Objects.equals(name, employee.name);
    }

    @Override
    public int hashCode() {
        // Must use the exact same fields as equals()!
        return Objects.hash(id, name);
    }
}`,
    complexity: "Average: O(1) put/get | Worst Case (all collisions before Java 8): O(n) | Worst Case (Java 8 Treeified): O(log n)",
    commonMistakes: "Returning a constant hashCode (e.g. return 1) which degrades HashMap into a single linked list/tree; modifying fields of a key object after inserting it into HashMap.",
    followUpQuestions: [
      "What is the default load factor of HashMap (0.75) and what triggers rehashing?",
      "What is ConcurrentHashMap and how does it achieve thread safety without synchronizing the entire map?"
    ],
    tags: ["Java", "HashMap", "Collections", "Hashing", "Data Structures"]
  },
  {
    id: "java-02",
    topic: "java",
    topicName: "Java",
    role: "Java Developer",
    category: "technical",
    difficulty: "hard",
    experienceLevel: "mid",
    question: "Explain the JVM Memory Model (Heap, Stack, Metaspace) and how Garbage Collection works.",
    modelAnswer: `The **Java Virtual Machine (JVM)** divides runtime data into specific memory regions:

1. **JVM Memory Structure:**
   - **Heap Memory:** Shared across all threads. Stores all object instances and arrays. Divided into:
     - **Young Generation:** Eden Space (new objects) and two Survivor spaces (S0, S1). Minor GC collects short-lived objects here.
     - **Old Generation (Tenured):** Objects that survive multiple GC cycles (aging threshold, default 15) are promoted here. Major/Full GC runs here.
   - **Stack Memory:** Thread-private. Stores method frames, local primitive variables, and references pointing to objects in the Heap. LIFO order; freed when methods return.
   - **Metaspace (Java 8+):** Stores class metadata and static variables. Allocated in **native OS memory** (unlike Java 7 PermGen which had fixed limits).

2. **Garbage Collection (GC) Mechanism:**
   - GC identifies unreachable objects using **Root Reachability Analysis** (tracing from GC Roots like stack references, static variables, and JNI pointers).
   - Modern collectors include **G1 GC** (region-based, predictable pauses) and **ZGC** (sub-millisecond pause times for large multi-terabyte heaps).`,
    interviewerIntent: "Assesses production-level troubleshooting capacity, OutOfMemoryError diagnostics, and JVM tuning expertise.",
    answerBlueprint: "Break down Heap (Young: Eden, S0, S1 vs Old) vs Stack (local vars/threads) vs Metaspace. Explain GC roots reachability and compare G1 GC vs ZGC.",
    codeSnippet: `// Diagnostic JVM Flag Tuning Example
// -Xms4g -Xmx4g               (Sets initial and max heap to 4GB to prevent resizing)
// -XX:+UseG1GC                (Enables Garbage-First Garbage Collector)
// -XX:MaxGCPauseMillis=200    (Target maximum GC pause time)
// -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/log/java_heap.hprof`,
    complexity: "Minor GC: Fast (typically <10-20ms) | Full GC: Stop-the-world pause (targets <100ms in modern GC)",
    commonMistakes: "Believing Stack holds objects instead of primitives/references; confusing System.gc() with a guaranteed immediate garbage collection run.",
    followUpQuestions: [
      "What is the difference between StackOverflowError and OutOfMemoryError (OOM)?",
      "What are strong, soft, weak, and phantom references in Java?"
    ],
    tags: ["Java", "JVM", "Garbage Collection", "Memory Management", "Performance"]
  },

  // ==========================================
  // 5. SQL
  // ==========================================
  {
    id: "sql-01",
    topic: "sql",
    topicName: "SQL",
    role: "Backend / Database Engineer",
    category: "technical",
    difficulty: "easy",
    experienceLevel: "entry",
    question: "What is the difference between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN in SQL?",
    modelAnswer: `SQL Joins combine rows from two or more tables based on a related column between them:

1. **INNER JOIN:** Returns only rows where there is a matching value in **both** tables. Unmatched rows from either table are discarded.
2. **LEFT JOIN (or LEFT OUTER JOIN):** Returns **all** rows from the left table, plus matched rows from the right table. If no match exists on the right, \`NULL\` values are populated for right-table columns.
3. **RIGHT JOIN (or RIGHT OUTER JOIN):** Returns **all** rows from the right table, plus matched rows from the left table. Unmatched left columns become \`NULL\`.
4. **FULL OUTER JOIN:** Returns all rows from both tables. When rows match, values are joined; when there is no match on either side, \`NULL\` fills the missing side.
5. **CROSS JOIN:** Produces a Cartesian product, combining every row from the first table with every row from the second table (size = N * M).`,
    interviewerIntent: "Verifies relational data modeling skills, join logic, and accurate handling of NULL values in production queries.",
    answerBlueprint: "Explain each join type with row inclusion criteria. Highlight how unmatched records produce NULLs. Provide a clear business example (Customers and Orders).",
    codeSnippet: `-- Retrieve all customers and their orders (including customers with 0 orders)
SELECT 
    c.customer_id,
    c.name,
    COALESCE(SUM(o.amount), 0) AS total_spent,
    COUNT(o.order_id) AS order_count
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE c.status = 'active'
GROUP BY c.customer_id, c.name
HAVING total_spent > 1000;`,
    complexity: "Time: Hash Join / Merge Join O(N + M) with index | Nested Loop: O(N * M) without index",
    commonMistakes: "Filtering the right table in the WHERE clause instead of the ON clause, which inadvertently turns a LEFT JOIN into an INNER JOIN.",
    followUpQuestions: [
      "Why does putting a filter in the WHERE clause convert a LEFT JOIN into an INNER JOIN?",
      "What is the difference between UNION and UNION ALL?"
    ],
    tags: ["SQL", "Joins", "Databases", "RDBMS", "Queries"]
  },
  {
    id: "sql-02",
    topic: "sql",
    topicName: "SQL",
    role: "Database Engineer / Data Analyst",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "What is the difference between WHERE and HAVING clauses in SQL, and what is the logical query processing order?",
    modelAnswer: `Both clauses filter data, but they operate at completely different stages of the query lifecycle:

**WHERE vs HAVING:**
- **WHERE:** Filters individual rows **before** any grouping (\`GROUP BY\`) or aggregate functions (\`COUNT\`, \`SUM\`, \`AVG\`) are calculated. It cannot reference aggregate expressions.
- **HAVING:** Filters aggregated groups **after** the \`GROUP BY\` clause has consolidated the rows.

**Logical SQL Execution Order (Crucial for query debugging):**
1. \`FROM\` & \`JOIN\` (Table datasets are cross-referenced)
2. \`WHERE\` (Row-level filtering)
3. \`GROUP BY\` (Rows grouped into buckets)
4. \`HAVING\` (Aggregated group filtering)
5. \`SELECT\` (Expressions computed, columns selected)
6. \`DISTINCT\` (Duplicate rows removed)
7. \`ORDER BY\` (Sorting performed)
8. \`LIMIT\` / \`OFFSET\` (Pagination applied)`,
    interviewerIntent: "Tests whether the candidate understands query execution pipeline rather than writing SQL by trial and error.",
    answerBlueprint: "Contrast WHERE (pre-aggregation, row level) with HAVING (post-aggregation, group level). Write down the standard 8-step logical execution order.",
    codeSnippet: `-- Correct usage of WHERE and HAVING together
SELECT 
    department_id,
    AVG(salary) AS avg_salary,
    COUNT(*) AS employee_count
FROM employees
WHERE is_active = 1              -- Step 2: Filters active rows FIRST
GROUP BY department_id          -- Step 3: Groups remaining rows
HAVING AVG(salary) > 75000       -- Step 4: Filters grouped averages
ORDER BY avg_salary DESC;       -- Step 7: Sorts final results`,
    complexity: "Filtering early with WHERE reduces rows entering GROUP BY, significantly reducing CPU and memory consumption.",
    commonMistakes: "Using HAVING for filters that could be done in WHERE (e.g. HAVING department_id = 5), which forces the database to group unnecessary rows.",
    followUpQuestions: [
      "Can you use column aliases defined in SELECT inside the WHERE clause? Why or why not?",
      "What are Window Functions (OVER, PARTITION BY, ROW_NUMBER) and how do they differ from GROUP BY?"
    ],
    tags: ["SQL", "WHERE", "HAVING", "Query Execution", "Aggregation"]
  },

  // ==========================================
  // 6. MYSQL
  // ==========================================
  {
    id: "mysql-01",
    topic: "mysql",
    topicName: "MySQL",
    role: "Backend / Database Engineer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "What are the key differences between InnoDB and MyISAM storage engines in MySQL?",
    modelAnswer: `**InnoDB** (the default storage engine in MySQL 5.5+) and **MyISAM** represent two different storage architectures:

1. **ACID Transactions:**
   - **InnoDB:** Fully ACID-compliant with \`COMMIT\`, \`ROLLBACK\`, and crash recovery via Write-Ahead Logging (Redo Log & Undo Log).
   - **MyISAM:** Does not support transactions. Operations cannot be rolled back.

2. **Locking Granularity:**
   - **InnoDB:** Supports **Row-Level Locking** (and Next-Key locking). Highly concurrent read/write throughput because updating row A does not block row B.
   - **MyISAM:** Uses **Table-Level Locking**. Any \`UPDATE\` or \`INSERT\` locks the entire table, causing severe write bottlenecks.

3. **Data Integrity & Foreign Keys:**
   - **InnoDB:** Enforces Foreign Key constraints (\`FOREIGN KEY ... REFERENCES\`).
   - **MyISAM:** Ignores foreign key constraints.

4. **Clustered Index Architecture:**
   - **InnoDB:** Primary key is stored as a **Clustered Index** where table rows live directly in the leaf pages of the primary key B+ Tree. Secondary indexes store primary key values as pointers.
   - **MyISAM:** Uses non-clustered indexes where leaf nodes contain physical file offset pointers.`,
    interviewerIntent: "Checks practical database administration and architecture decisions in MySQL production deployments.",
    answerBlueprint: "Compare ACID support, row vs table locking, crash recovery (Redo/Undo logs), Foreign Keys, and Clustered vs Non-clustered indexing.",
    codeSnippet: `-- Inspect storage engine of tables
SHOW TABLE STATUS WHERE Name = 'orders';

-- Ensure InnoDB is used with utf8mb4 encoding
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    complexity: "InnoDB Row Locking: High concurrency | MyISAM Table Locking: Degrades under write-heavy loads to O(N) waiting queues",
    commonMistakes: "Using MyISAM for financial or transactional systems; failing to use utf8mb4 in MySQL, which truncates 4-byte emojis and international characters.",
    followUpQuestions: [
      "What is the function of the InnoDB Buffer Pool and how do you size it in production?",
      "How does MySQL handle deadlocks and how can application queries minimize them?"
    ],
    tags: ["MySQL", "InnoDB", "Storage Engines", "Transactions", "Locking"]
  },
  {
    id: "mysql-02",
    topic: "mysql",
    topicName: "MySQL",
    role: "Backend Engineer",
    category: "technical",
    difficulty: "hard",
    experienceLevel: "mid",
    question: "How do you optimize slow MySQL queries using EXPLAIN, and what do the 'type' and 'Extra' columns signify?",
    modelAnswer: `The \`EXPLAIN\` statement displays MySQL's query execution plan, showing how MySQL optimizes and executes queries against indexes:

**1. The 'type' Column (Join Type / Access Method — Best to Worst):**
- \`system\` / \`const\`: Table has 1 matching row, retrieved in O(1) via Primary Key or Unique index.
- \`eq_ref\`: 1 row read for each previous table row in a join (best join type).
- \`ref\`: Non-unique index lookup (multiple matching rows with same index value).
- \`range\`: Index range scan (using \`>\`, \`<\`, \`BETWEEN\`, \`IN\`).
- \`index\`: Full index scan (scans entire index tree; better than table scan but still slow).
- \`ALL\`: **Full Table Scan** (worst; scans every raw data block on disk).

**2. The 'Extra' Column (Critical Signals):**
- \`Using index\` (Covering Index): Query is fulfilled **entirely from the index tree** without touching table disk rows (fastest).
- \`Using where\`: Rows filtered by WHERE condition after reading from storage.
- \`Using filesort\`: MySQL must perform an extra sorting pass on disk/memory (indicates missing index for \`ORDER BY\`).
- \`Using temporary\`: MySQL creates an in-memory or on-disk temporary table to hold intermediate results (common with \`GROUP BY\` without matching index).`,
    interviewerIntent: "Tests query performance profiling, index design, and elimination of table scans in high-scale MySQL production systems.",
    answerBlueprint: "Walk through EXPLAIN columns: type hierarchy (const -> ref -> range -> index -> ALL) and key Extra signals (Using index vs Using filesort).",
    codeSnippet: `-- Profiling a slow query
EXPLAIN ANALYZE
SELECT u.name, o.total_amount
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.created_at >= '2026-01-01' AND o.status = 'PAID'
ORDER BY o.total_amount DESC;

-- Solution: Add Composite Covering Index
CREATE INDEX idx_orders_status_date_amount 
ON orders (status, created_at, total_amount, user_id);`,
    complexity: "Transforming 'type: ALL' (O(N) full table scan) to 'type: ref/range' (O(log N) B+ Tree index lookup).",
    commonMistakes: "Indexing every column individually instead of creating composite indexes based on query selectivity; not realizing that function calls on columns (e.g. WHERE YEAR(created_at) = 2026) invalidate indexes.",
    followUpQuestions: [
      "What is the Leftmost Prefix Rule for composite indexes in MySQL?",
      "What is a Covering Index and why is it faster than standard index lookups?"
    ],
    tags: ["MySQL", "EXPLAIN", "Optimization", "Indexing", "Query Tuning"]
  },

  // ==========================================
  // 7. HTML
  // ==========================================
  {
    id: "html-01",
    topic: "html",
    topicName: "HTML",
    role: "Frontend / Full Stack Developer",
    category: "technical",
    difficulty: "easy",
    experienceLevel: "entry",
    question: "What is Semantic HTML5, why is it critical for accessibility (a11y) and SEO, and what are its core elements?",
    modelAnswer: `**Semantic HTML** means using HTML tags that convey the meaning and structure of the content to both the browser, screen readers, and search engine crawlers, rather than using non-semantic elements like \`<div>\` and \`<span>\` purely for styling.

**Why it matters:**
1. **Accessibility (WCAG):** Screen readers use semantic landmarks (like \`<main>\`, \`<nav>\`, \`<header>\`) to allow visually impaired users to jump directly to specific sections using keyboard shortcuts. Native interactive elements (like \`<button>\`) have built-in keyboard focus and click handlers.
2. **SEO (Search Engine Optimization):** Search engine bots parse semantic hierarchy (\`<h1>\` through \`<h6>\`, \`<article>\`) to index page weight and relevance accurately.
3. **Maintainability:** Makes code self-documenting and clean for engineering teams.

**Key Semantic Elements:**
- \`<header>\`, \`<nav>\`, \`<main>\`, \`<section>\`, \`<article>\`, \`<aside>\`, \`<footer>\`, \`<figure>\`, \`<figcaption>\`, \`<time>\`.`,
    interviewerIntent: "Assesses front-end fundamentals, commitment to web accessibility standards, and clean code hygiene.",
    answerBlueprint: "Define semantics (meaning over presentation). List the 3 pillars: Accessibility, SEO, and maintainability. Enumerate core semantic elements and compare <button> vs <div onclick>.",
    codeSnippet: `<!-- BAD: "Div Soup" - Zero accessibility or semantic meaning -->
<div class="header">
    <div class="nav-btn" onclick="goToHome()">Home</div>
</div>

<!-- GOOD: Fully accessible semantic HTML5 -->
<header>
    <nav aria-label="Main Navigation">
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/topics">Topics</a></li>
        </ul>
    </nav>
</header>
<main>
    <article>
        <h1>Mastering HTML5 Semantics</h1>
        <p>Published on <time datetime="2026-09-12">Sept 12, 2026</time></p>
    </article>
</main>`,
    complexity: "Native semantic elements provide free keyboard navigation (Tab/Enter/Space) with zero extra JavaScript overhead.",
    commonMistakes: "Using multiple <h1> tags per page; turning <div> elements into buttons without adding tabindex, role='button', and keyboard event listeners.",
    followUpQuestions: [
      "What is the first rule of ARIA?",
      "How do alt attributes on <img> tags impact accessibility, and what is decorative image handling (alt='')?"
    ],
    tags: ["HTML", "Accessibility", "Semantic HTML5", "SEO", "Frontend"]
  },
  {
    id: "html-02",
    topic: "html",
    topicName: "HTML",
    role: "Frontend Developer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "What is the difference between <script>, <script async>, and <script defer> in HTML?",
    modelAnswer: `When a browser's HTML parser encounters a \`<script>\` tag, its execution behavior depends on the attributes provided:

1. **Regular \`<script>\` (Render-Blocking):**
   - HTML parsing **pauses immediately**.
   - The script is downloaded from the network.
   - The script executes immediately.
   - HTML parsing only resumes after script execution finishes. Causes visible page freeze if placed in \`<head>\`.

2. **\`<script async>\` (Independent Asynchronous Loading):**
   - Downloaded in the background in parallel with HTML parsing.
   - **Executes the exact moment it finishes downloading**, briefly pausing HTML parsing during execution.
   - **Warning:** Execution order is NOT guaranteed. If Script A is downloaded after Script B, Script B executes first. Best for independent scripts (e.g. Google Analytics).

3. **\`<script defer>\` (Deferred Execution - Recommended for apps):**
   - Downloaded in parallel with HTML parsing.
   - **Executes only AFTER HTML parsing is completely finished**, right before the \`DOMContentLoaded\` event fires.
   - **Order is strictly preserved:** Scripts execute in the exact order they appear in the HTML document.`,
    interviewerIntent: "Tests Web Performance Optimization (Core Web Vitals, Largest Contentful Paint) and DOM rendering pipeline knowledge.",
    answerBlueprint: "Explain default render-blocking parser pause. Contrast async (executes immediately upon download, non-deterministic order) with defer (executes after DOM parse, deterministic order).",
    codeSnippet: `<!-- Best Practice in Modern HTML5 Head -->
<head>
    <!-- Critical Stylesheet (parses first) -->
    <link rel="stylesheet" href="style.css" />

    <!-- Independent tracker: async is ideal -->
    <script async src="https://www.google-analytics.com/analytics.js"></script>

    <!-- Application code with dependencies: defer guarantees order -->
    <script defer src="vendor.js"></script>
    <script defer src="app.js"></script>
</head>`,
    complexity: "defer prevents render-blocking, drastically improving First Contentful Paint (FCP) and Largest Contentful Paint (LCP).",
    commonMistakes: "Using async for scripts that depend on each other (e.g., jQuery plugin loaded before jQuery); placing unadorned scripts in the <head>.",
    followUpQuestions: [
      "What is the difference between DOMContentLoaded and the window.onload event?",
      "What are resource hints: preload, prefetch, and dns-prefetch?"
    ],
    tags: ["HTML", "Web Performance", "Script Loading", "DOM", "Frontend"]
  },

  // ==========================================
  // 8. CSS
  // ==========================================
  {
    id: "css-01",
    topic: "css",
    topicName: "CSS",
    role: "Frontend / UI Developer",
    category: "technical",
    difficulty: "easy",
    experienceLevel: "entry",
    question: "Explain the CSS Box Model and the practical impact of 'box-sizing: border-box'.",
    modelAnswer: `Every HTML element rendered on a web page is treated as a rectangular box. The **CSS Box Model** consists of 4 concentric layers from inside to outside:

1. **Content:** The actual text, image, or media of the element.
2. **Padding:** Transparent spacing surrounding the content (inside the border).
3. **Border:** A stroke wrapping the padding and content.
4. **Margin:** Transparent spacing outside the border, separating the element from adjacent elements.

**The Box-Sizing Difference:**
- **\`box-sizing: content-box\` (Default):** \`width\` and \`height\` apply **only to the content**. If you set \`width: 200px; padding: 20px; border: 5px;\`, the total rendered width becomes \`200 + 40 + 10 = 250px\`! This breaks layouts and grids unexpectedly.
- **\`box-sizing: border-box\` (Modern Standard):** \`width\` and \`height\` encompass **content + padding + border**. If you set \`width: 200px\`, the total rendered element will always remain exactly \`200px\` wide, with padding and border absorbing inward.`,
    interviewerIntent: "Checks basic CSS styling, predictable layout construction, and standard CSS resets.",
    answerBlueprint: "Describe the 4 layers (Content, Padding, Border, Margin). Explain content-box calculation vs border-box calculation. Show standard global reset.",
    codeSnippet: `/* Modern CSS Global Reset for Predictable Layouts */
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

/* Example: Card stays strictly 300px wide */
.card {
    width: 300px;
    padding: 24px;
    border: 2px solid #6366f1;
    /* With border-box, total width is exactly 300px! */
}`,
    complexity: "Eliminates layout shifts and recalculation bugs across responsive breakpoints.",
    commonMistakes: "Not applying border-box to pseudo-elements (*::before, *::after); forgetting that vertical margins collapse between adjacent block elements.",
    followUpQuestions: [
      "What is margin collapsing and in what scenarios does it occur?",
      "What is the difference between display: none and visibility: hidden?"
    ],
    tags: ["CSS", "Box Model", "Layout", "Border-Box", "Frontend"]
  },
  {
    id: "css-02",
    topic: "css",
    topicName: "CSS",
    role: "Frontend Engineer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "What is the difference between CSS Flexbox and CSS Grid, and when should you choose one over the other?",
    modelAnswer: `Both **Flexbox** and **CSS Grid** are powerful CSS layout models, but they serve fundamentally different layout dimensions:

**1. Dimensionality:**
- **Flexbox (One-Dimensional):** Designed for layouts in a **single direction at a time** — either as a row OR as a column.
- **CSS Grid (Two-Dimensional):** Designed for simultaneous control over **both rows AND columns** together.

**2. Content-First vs. Layout-First:**
- **Flexbox is Content-Driven:** Flex items size themselves based on their content, and flexbox arranges them fluidly along the main axis.
- **Grid is Layout-Driven:** You define the structural grid matrix first (\`grid-template-columns: repeat(3, 1fr)\`), and children place themselves into defined cells.

**When to Use Which:**
- **Use Flexbox:** For navigation bars, button groups, aligning icons with text, centering content vertically/horizontally, and linear item distributions.
- **Use Grid:** For overall page layouts, multi-column dashboard card grids, image galleries with equal/masonry sizing, and complex dashboard interfaces.`,
    interviewerIntent: "Evaluates modern CSS layout capability and clean responsive component architecture.",
    answerBlueprint: "Contrast 1D (Flexbox) vs 2D (Grid). Contrast content-first vs layout-first. Give specific examples for each (Flexbox: navbar/centering; Grid: dashboard/cards).",
    codeSnippet: `/* 1. Flexbox: Perfect for Navigation Bars */
.nav-header {
    display: flex;
    justify-content: space-between; /* Horizontal spacing */
    align-items: center;            /* Vertical centering */
}

/* 2. CSS Grid: Perfect for Responsive Card Galleries */
.dashboard-grid {
    display: grid;
    /* Auto-fit responsive columns without media queries! */
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
}`,
    complexity: "Modern Grid auto-fit and auto-fill minimize or eliminate media query boilerplate.",
    commonMistakes: "Using complex nested flexboxes with fixed percentages when CSS Grid solves it in 2 lines; confusing justify-content (main axis) with align-items (cross axis).",
    followUpQuestions: [
      "What does the fr unit in CSS Grid represent?",
      "How do you center a div vertically and horizontally using Flexbox vs CSS Grid?"
    ],
    tags: ["CSS", "Flexbox", "CSS Grid", "Responsive Design", "UI"]
  },

  // ==========================================
  // 9. JAVASCRIPT
  // ==========================================
  {
    id: "js-01",
    topic: "javascript",
    topicName: "JavaScript",
    role: "Full Stack / JavaScript Developer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "How does the JavaScript Event Loop work, and what is the exact execution priority between Call Stack, Microtasks, and Macrotasks?",
    modelAnswer: `JavaScript is single-threaded, with a single Call Stack that executes code in a run-to-completion model. Asynchronous concurrency is orchestrated by the **Event Loop**:

1. **Call Stack:** Executes synchronous functions in LIFO order (Last In, First Out).
2. **Web APIs / Node APIs:** Handles background operations (network requests via \`fetch\`, DOM events, timers like \`setTimeout\`). When finished, their callbacks are sent to the appropriate task queues.
3. **Microtask Queue:** Holds high-priority callbacks from Promises (\`.then\`, \`.catch\`, \`.finally\`), \`queueMicrotask()\`, and \`MutationObserver\` (or \`process.nextTick\` in Node).
4. **Macrotask Queue (Task Queue):** Holds standard callbacks from \`setTimeout\`, \`setInterval\`, \`setImmediate\`, and I/O callbacks.

**The Golden Priority Rule:**
When the Call Stack is empty, the Event Loop **completely drains all pending Microtasks** before taking the single next task from the Macrotask Queue. Even if microtasks spawn new microtasks, they must all resolve before any macrotask runs.`,
    interviewerIntent: "Checks fundamental mastery of asynchronous execution in JavaScript, preventing common race conditions and UI freezing.",
    answerBlueprint: "Outline Call Stack -> Web APIs -> Microtask Queue -> Macrotask Queue. Emphasize that the Microtask queue must be completely drained before the next macrotask is picked up.",
    codeSnippet: `console.log("1: Synchronous");

setTimeout(() => {
    console.log("2: Macrotask (setTimeout)");
}, 0);

Promise.resolve().then(() => {
    console.log("3: Microtask 1 (Promise)");
}).then(() => {
    console.log("4: Microtask 2 (Promise Chained)");
});

console.log("5: Synchronous End");

// Output Order:
// 1: Synchronous
// 5: Synchronous End
// 3: Microtask 1 (Promise)
// 4: Microtask 2 (Promise Chained)
// 2: Macrotask (setTimeout)`,
    complexity: "Single-threaded non-blocking I/O model.",
    commonMistakes: "Assuming setTimeout(fn, 0) runs immediately after the current line; microtask starvation causing UI freeze if promises loop indefinitely.",
    followUpQuestions: [
      "What happens if a microtask recursively enqueues another microtask?",
      "How does process.nextTick in Node.js differ from Promise.resolve()?"
    ],
    tags: ["JavaScript", "Event Loop", "Async", "Promises", "Microtasks"]
  },
  {
    id: "js-02",
    topic: "javascript",
    topicName: "JavaScript",
    role: "JavaScript / Frontend Developer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "What is a Closure in JavaScript, how does it work in memory, and what is a practical real-world use case?",
    modelAnswer: `A **closure** is a function bundled together with references to its surrounding state (its **lexical environment**). In JavaScript, every inner function retains access to variables from its outer enclosing scope, even after that outer function has finished executing and returned.

**Memory Mechanism:**
Normally, local variables declared inside a function are allocated on the stack and garbage-collected once the function returns. However, if an inner function references outer variables and is returned or retained (e.g. as an event listener or exported object), the JavaScript engine moves those referenced variables to **heap memory**, keeping the scope chain alive.

**Practical Use Cases:**
1. **Data Encapsulation / Private State:** Emulating private variables before ES6 private class fields (\`#\`).
2. **Factory Functions & Currying:** Customizing reusable function pipelines.
3. **Debounce / Throttle Utilities:** Storing timer IDs between consecutive function calls.`,
    interviewerIntent: "Checks comprehension of lexical scoping, execution contexts, heap vs stack memory retention, and functional programming patterns.",
    answerBlueprint: "Define closure (function + lexical environment). Explain why variables aren't garbage-collected. Provide a practical production example: debounce or private counter.",
    codeSnippet: `// Practical Real-World Closure: Debounce Function
function debounce(fn, delay) {
    let timerId; // Retained in heap memory via closure!
    
    return function (...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

// Search input fires at most once every 300ms
const handleSearch = debounce((query) => {
    console.log("Searching API for:", query);
}, 300);`,
    complexity: "Time: O(1) invocation | Space: Retains referenced scope variables in heap until inner function is garbage-collected.",
    commonMistakes: "Creating accidental memory leaks by retaining large unused DOM references inside closures; confusing closures with standard object methods.",
    followUpQuestions: [
      "Can closures cause memory leaks in single-page applications and how do you prevent them?",
      "How did the ES6 'let' keyword solve the classic 'var in for-loop setTimeout' problem?"
    ],
    tags: ["JavaScript", "Closures", "Scope", "Memory", "Functional Programming"]
  },

  // ==========================================
  // 10. NODE.JS
  // ==========================================
  {
    id: "node-01",
    topic: "nodejs",
    topicName: "Node.js",
    role: "Backend / Node.js Engineer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "How does Node.js handle non-blocking asynchronous I/O, and what is the role of libuv?",
    modelAnswer: `Node.js is built on the **Google V8 JavaScript engine** and **libuv**, a multi-platform C library that handles asynchronous I/O:

**Architecture & libuv Role:**
1. **Single-Threaded Event Loop:** The main JavaScript execution thread runs synchronously. When an asynchronous operation (file system, network socket, crypto) is initiated, Node offloads it.
2. **libuv Event Loop & Thread Pool:**
   - **Network I/O (HTTP, Sockets):** Handled directly by the OS kernel using asynchronous notification mechanisms (epoll on Linux, kqueue on macOS, IOCP on Windows). This requires zero worker threads!
   - **File System (\`fs\`), DNS lookups, and Crypto (\`crypto.pbkdf2\`):** Handled by libuv's **Worker Thread Pool** (default size: 4 threads, configurable via \`UV_THREADPOOL_SIZE\`).
3. **Completion:** When the OS or worker thread finishes, libuv pushes the callback to the event loop's task queues to execute JavaScript callbacks without blocking other incoming requests.`,
    interviewerIntent: "Assesses understanding of Node's architectural scalability, thread pool limits, and CPU vs I/O boundaries.",
    answerBlueprint: "Explain V8 vs libuv. Clarify that Network I/O uses OS epoll/kqueue (no threads needed), while fs/crypto uses libuv thread pool. Mention UV_THREADPOOL_SIZE.",
    codeSnippet: `// Configuring libuv thread pool for heavy cryptographic operations
// (Must be set before any async operations occur!)
process.env.UV_THREADPOOL_SIZE = 8;

const crypto = require('crypto');

// These 4 hash operations run in parallel across the libuv thread pool
for (let i = 0; i < 4; i++) {
    crypto.pbkdf2('password', 'salt', 100000, 512, 'sha512', () => {
        console.log(\`Hash \${i + 1} completed\`);
    });
}`,
    complexity: "High-concurrency I/O with low memory overhead (~30MB per Node process vs hundreds of MBs in thread-per-request servers).",
    commonMistakes: "Executing heavy synchronous CPU operations (e.g. JSON.parse of huge files or massive regex) on the main thread, which blocks all concurrent user requests.",
    followUpQuestions: [
      "What is the difference between setImmediate() and process.nextTick() in Node.js?",
      "How do you scale a Node.js server across multiple CPU cores (Cluster module / PM2)?"
    ],
    tags: ["Node.js", "libuv", "Architecture", "Asynchronous", "Event Loop"]
  },
  {
    id: "node-02",
    topic: "nodejs",
    topicName: "Node.js",
    role: "Backend Engineer",
    category: "technical",
    difficulty: "hard",
    experienceLevel: "mid",
    question: "What are Node.js Streams and Backpressure, and why are they essential when processing large files?",
    modelAnswer: `**Streams** are Unix-like data-handling abstractions in Node.js that read or write continuous chunks of data piece-by-piece, rather than buffering an entire file into memory at once.

**Types of Streams:**
1. \`Readable\` (e.g. \`fs.createReadStream\`, \`http.IncomingMessage\`)
2. \`Writable\` (e.g. \`fs.createWriteStream\`, \`http.ServerResponse\`)
3. \`Duplex\` (Both readable and writable, e.g. TCP sockets)
4. \`Transform\` (Modifies data while reading/writing, e.g. \`zlib.createGzip\`)

**What is Backpressure?**
Backpressure occurs when the data producer (Readable stream) reads data faster than the consumer (Writable stream) can write or process it.
- Without backpressure control, incoming data buffers uncontrollably in RAM, eventually causing an **Out of Memory (OOM)** crash.
- Node's \`stream.pipe()\` and modern \`pipeline()\` automatically handle backpressure: when the writable buffer fills (\`highWaterMark\` reached), reading is paused until the \`drain\` event fires.`,
    interviewerIntent: "Tests enterprise backend reliability, memory management, and stream pipelines for multi-gigabyte data transfer.",
    answerBlueprint: "1) Define streams and the 4 types. 2) Contrast buffering vs streaming. 3) Explain backpressure and internal highWaterMark buffers. 4) Use stream.pipeline for safe error handling.",
    codeSnippet: `const fs = require('fs');
const zlib = require('zlib');
const { pipeline } = require('stream/promises');

// Safely compress and transfer a 10GB log file using ~30MB memory
async function compressFile(source, destination) {
    try {
        await pipeline(
            fs.createReadStream(source),
            zlib.createGzip(),
            fs.createWriteStream(destination)
        );
        console.log('File compressed successfully with zero memory spikes!');
    } catch (err) {
        console.error('Pipeline failed:', err);
    }
}`,
    complexity: "Memory usage: O(1) bounded by highWaterMark (default 16KB/64KB) regardless of whether the file is 100MB or 100GB.",
    commonMistakes: "Using fs.readFile() on large files in production; using pipe() without listening for error events on every stream (leading to memory leaks and uncaught exceptions).",
    followUpQuestions: [
      "Why is stream/promises pipeline preferred over standard pipe()?",
      "How does Transform stream differ from PassThrough stream?"
    ],
    tags: ["Node.js", "Streams", "Backpressure", "Memory", "Pipelines"]
  },

  // ==========================================
  // 11. REACT
  // ==========================================
  {
    id: "react-01",
    topic: "react",
    topicName: "React",
    role: "Frontend / React Developer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "How does the Virtual DOM and Reconciliation (React Fiber) work, and why is the 'key' prop necessary in lists?",
    modelAnswer: `The **Virtual DOM (VDOM)** is a lightweight JavaScript representation of the actual browser DOM kept in memory.

**Reconciliation & React Fiber:**
1. When component state or props change, React generates a new Virtual DOM tree.
2. React's **Diffing Algorithm** compares the new tree with the previous snapshot:
   - Elements of different types are completely destroyed and remounted.
   - Elements of the same type retain their DOM node; only modified attributes/styles are patched.
3. **React Fiber:** Introduced an incremental rendering engine capable of splitting rendering work into priority chunks across animation frames, preventing main-thread UI jank.

**Why the 'key' prop is required:**
When rendering dynamic arrays, the \`key\` prop gives each element a persistent, unique identity. During reconciliation:
- With keys, React matches existing DOM nodes and only moves or updates items that changed.
- **Without keys (or using array index):** If an item is prepended or sorted, every subsequent node is re-rendered with mismatched state, causing subtle input bugs and severe performance degradation.`,
    interviewerIntent: "Checks deep comprehension of React's rendering lifecycle, optimization mechanics, and avoiding common state bugs in dynamic lists.",
    answerBlueprint: "Define Virtual DOM. Explain Diffing algorithm (O(n) heuristics) and Fiber incremental rendering. Explain why unique keys prevent re-rendering and UI state bugs.",
    codeSnippet: `// BAD: Using array index as key causes state corruption on reordering!
{items.map((item, index) => <TodoItem key={index} {...item} />)}

// GOOD: Use stable, unique ID
{items.map(item => <TodoItem key={item.id} {...item} />)}`,
    complexity: "Diffing: O(N) heuristic comparison instead of O(N^3) generic tree diff.",
    commonMistakes: "Using Math.random() as key (destroys and recreates DOM on every render); using array index for lists that filter, delete, or sort.",
    followUpQuestions: [
      "What is React Fiber and how does it enable Concurrent Mode and Suspense?",
      "What is the difference between React.memo and useMemo?"
    ],
    tags: ["React", "Virtual DOM", "Fiber", "Reconciliation", "Keys"]
  },
  {
    id: "react-02",
    topic: "react",
    topicName: "React",
    role: "React / Frontend Engineer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "What is the difference between useEffect, useMemo, and useCallback, and what causes infinite re-render loops?",
    modelAnswer: `These three React Hooks optimize component lifecycle and rendering performance:

1. **useEffect(effectFn, deps):**
   - Handles **side effects** (data fetching, DOM mutations, subscriptions).
   - Runs **asynchronously after the browser paints**. Cleanup function runs before next effect and unmount.

2. **useMemo(calculateFn, deps):**
   - **Memoizes a computed value**. Only recalculates when dependencies change.
   - Used to prevent expensive calculations from running on every render.

3. **useCallback(callbackFn, deps):**
   - **Memoizes a function reference**. In JavaScript, inline functions are recreated on every render with a new memory reference (\`() => {}\`).
   - Used when passing callback functions to memoized child components (\`React.memo\`) to prevent unnecessary child re-renders.

**What causes infinite re-render loops?**
- Setting state inside \`useEffect\` where that state (or an object derived from it) is also included in the \`useEffect\` dependency array without proper memoization or guards.
- Modifying state directly in the component render body: \`setCount(count + 1)\`.`,
    interviewerIntent: "Assesses practical mastery of React hooks, reference equality, and avoiding costly re-renders.",
    answerBlueprint: "Compare useEffect (side effects after paint) vs useMemo (memoized value) vs useCallback (memoized function reference). Explain reference identity and dependency loop traps.",
    codeSnippet: `function UserList({ fetchUsers }) {
    // 1. useMemo prevents expensive sorting on unrelated state changes
    const sortedUsers = useMemo(() => {
        return users.sort((a, b) => a.score - b.score);
    }, [users]);

    // 2. useCallback keeps function reference stable for child component
    const handleSelect = useCallback((id) => {
        console.log("Selected user:", id);
    }, []); // Empty deps: reference never changes

    return <UserTable users={sortedUsers} onSelect={handleSelect} />;
}`,
    complexity: "useMemo/useCallback trade memory for CPU computation speed.",
    commonMistakes: "Overusing useMemo for trivial calculations (e.g. 2 + 2) where the hook overhead exceeds the savings; forgetting cleanup functions in useEffect.",
    followUpQuestions: [
      "What is a stale closure in React hooks and how do you fix it with functional state updates?",
      "When would you use useLayoutEffect instead of useEffect?"
    ],
    tags: ["React", "Hooks", "useEffect", "useMemo", "useCallback"]
  },

  // ==========================================
  // 12. DATA STRUCTURES (DS)
  // ==========================================
  {
    id: "ds-01",
    topic: "ds",
    topicName: "Data Structures (DS)",
    role: "Software Engineer / Algorithms",
    category: "technical",
    difficulty: "easy",
    experienceLevel: "entry",
    question: "What is the difference between an Array and a Linked List in memory and operations?",
    modelAnswer: `**Arrays** and **Linked Lists** are two fundamental linear data structures with opposing trade-offs:

1. **Memory Allocation:**
   - **Array:** Elements are stored in a **contiguous block of memory**.
   - **Linked List:** Elements (Nodes) are scattered in heap memory, linked together by pointers (memory addresses).

2. **Access Time:**
   - **Array:** **O(1) Random Access** using index formula: \`address = base + (index * element_size)\`.
   - **Linked List:** **O(N) Sequential Access** (must traverse from head node pointer by pointer).

3. **Insertion & Deletion:**
   - **Array:** **O(N)** in worst/average case because all subsequent elements must be shifted in memory.
   - **Linked List:** **O(1)** if pointer to insertion node is already known (just update pointer links).

4. **Cache Locality:**
   - Arrays exhibit excellent **CPU Cache Locality** (prefetcher loads adjacent elements into L1/L2 cache). Linked lists suffer from poor cache locality due to scattered node pointers.`,
    interviewerIntent: "Foundational CS question evaluating memory layout, Big-O analysis, and hardware cache awareness.",
    answerBlueprint: "Compare contiguous vs scattered memory, O(1) random access vs O(N) traversal, insertion/deletion shifting vs pointer updates, and CPU cache line locality.",
    codeSnippet: `// 1. Singly Linked List Node Structure
class ListNode {
    constructor(val) {
        this.val = val;
        this.next = null; // Pointer to next node
    }
}

// 2. O(1) Insertion at Head of Linked List
function insertAtHead(head, newVal) {
    const newNode = new ListNode(newVal);
    newNode.next = head;
    return newNode; // New head
}`,
    complexity: "Array: Access O(1), Insert/Delete O(N) | Linked List: Access O(N), Insert/Delete O(1)",
    commonMistakes: "Stating linked lists always have faster insertions without mentioning you must first spend O(N) time finding the node.",
    followUpQuestions: [
      "What is the difference between a Singly Linked List and a Doubly Linked List?",
      "How do you detect a cycle in a Linked List (Floyd's Tortoise and Hare algorithm)?"
    ],
    tags: ["Data Structures", "Arrays", "Linked Lists", "Complexity", "Algorithms"]
  },
  {
    id: "ds-02",
    topic: "ds",
    topicName: "Data Structures (DS)",
    role: "Software Engineer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "What is a Binary Search Tree (BST), what are its time complexities, and how does an AVL or Red-Black Tree prevent worst-case degradation?",
    modelAnswer: `A **Binary Search Tree (BST)** is a node-based binary tree data structure where for every node:
- All keys in the **left subtree** are strictly **less than** the node's key.
- All keys in the **right subtree** are strictly **greater than** the node's key.

**Time Complexity:**
- **Balanced BST:** Search, Insert, and Delete take **O(log N)** time because half the search space is eliminated at each step.
- **Degenerate / Skewed BST:** If elements are inserted in sorted order (e.g. 1 -> 2 -> 3 -> 4 -> 5), the tree degrades into a Linked List, with operations collapsing to **O(N)**!

**Self-Balancing Trees (AVL & Red-Black Trees):**
Self-balancing trees automatically perform **Tree Rotations** (Left/Right rotations) during insertion and deletion to maintain bounded tree height:
- **AVL Tree:** Strictly balanced. For every node, height difference between subtrees (balance factor) is at most 1. Optimal for read-heavy applications.
- **Red-Black Tree:** Loosely balanced using color properties (Red/Black) ensuring no path is more than twice as long as any other. Fewer rotations on insertion/deletion (used in Java's \`TreeMap\` and C++'s \`std::map\`).`,
    interviewerIntent: "Assesses tree data structures, understanding of worst-case complexity degradation, and self-balancing mechanisms.",
    answerBlueprint: "Define BST rule (left < root < right). Show O(log N) vs O(N) degenerate tree. Explain why AVL and Red-Black trees use rotations to guarantee O(log N).",
    codeSnippet: `// BST In-Order Traversal (Always yields elements in sorted ascending order!)
function inOrderTraversal(root, result = []) {
    if (root !== null) {
        inOrderTraversal(root.left, result);
        result.push(root.val);
        inOrderTraversal(root.right, result);
    }
    return result;
}`,
    complexity: "Balanced: Search O(log N), Insert O(log N) | Unbalanced: O(N) worst case | In-order traversal: O(N)",
    commonMistakes: "Confusing a Binary Tree (at most 2 children per node) with a Binary Search Tree (ordered); forgetting that in-order traversal yields sorted order.",
    followUpQuestions: [
      "What are the 4 tree traversal algorithms (Inorder, Preorder, Postorder, Level-order BFS)?",
      "Why is a Red-Black Tree preferred over an AVL tree for standard library implementations?"
    ],
    tags: ["Data Structures", "Trees", "BST", "AVL", "Algorithms"]
  },
  {
    id: "ds-03",
    topic: "ds",
    topicName: "Data Structures (DS)",
    role: "Software Engineer / Algorithms",
    category: "technical",
    difficulty: "hard",
    experienceLevel: "mid",
    question: "How does a Hash Table achieve O(1) average lookup time, and how do Separate Chaining and Open Addressing resolve collisions?",
    modelAnswer: `A **Hash Table (Hash Map)** maps keys to values for rapid data retrieval:

**The Mechanism:**
1. A **Hash Function** takes a key (e.g. a string) and computes a numeric integer hash code.
2. The hash code is reduced to a valid array index: \`index = hash(key) % array_capacity\`.
3. If no two keys hash to the same index, operations take **O(1) constant time**.

**Collision Resolution Strategies:**
When two distinct keys produce the same bucket index, a collision occurs:

1. **Separate Chaining:**
   - Each array bucket stores a pointer to a **Linked List** (or Red-Black Tree).
   - Colliding keys are appended to the bucket's list.
   - Lookup traverses the list comparing keys via equality checks.
   
2. **Open Addressing (Closed Hashing):**
   - All elements are stored directly inside the array itself.
   - If bucket \`index\` is occupied:
     - **Linear Probing:** Checks next bucket: \`index + 1\`, \`index + 2\`, ... (can cause primary clustering).
     - **Quadratic Probing:** Checks \`index + 1^2\`, \`index + 2^2\`, ...
     - **Double Hashing:** Uses a secondary hash function to calculate step size.

**Load Factor & Rehashing:**
When \`load_factor = (items / capacity)\` exceeds a threshold (typically **0.75**), the array capacity is doubled, and all keys are re-hashed into the new table.`,
    interviewerIntent: "Probes foundational computer science architecture, hashing theory, and amortized complexity analysis.",
    answerBlueprint: "Explain hash function + index modulo. Compare Separate Chaining vs Open Addressing (Linear Probing). Define Load Factor (0.75) and Rehashing.",
    codeSnippet: `// Simple Hash Table with Separate Chaining in JavaScript
class SimpleHashTable {
    constructor(size = 53) {
        this.buckets = new Array(size).fill(null).map(() => []);
    }

    _hash(key) {
        let total = 0;
        const PRIME = 31;
        for (let i = 0; i < Math.min(key.length, 100); i++) {
            total = (total * PRIME + key.charCodeAt(i)) % this.buckets.length;
        }
        return total;
    }

    set(key, val) {
        const idx = this._hash(key);
        const bucket = this.buckets[idx];
        const existing = bucket.find(item => item[0] === key);
        if (existing) {
            existing[1] = val;
        } else {
            bucket.push([key, val]);
        }
    }

    get(key) {
        const idx = this._hash(key);
        const pair = this.buckets[idx].find(item => item[0] === key);
        return pair ? pair[1] : undefined;
    }
}`,
    complexity: "Average: O(1) Insert/Search/Delete | Worst case (all collide): O(N) | Space: O(N)",
    commonMistakes: "Assuming Hash Tables are always strictly O(1) without mentioning the O(N) worst case on poor hash functions; forgetting that rehashing is O(N) amortized.",
    followUpQuestions: [
      "What makes a good hash function (uniform distribution, deterministic, fast)?",
      "What is consistent hashing and where is it used in distributed systems?"
    ],
    tags: ["Data Structures", "Hash Table", "Hashing", "Collisions", "Algorithms"]
  }
];

const CAREER_ROADMAPS = [
  {
    id: "c-systems",
    title: "C / Embedded Systems Engineer",
    icon: "⚙️",
    level: "Junior to Senior",
    salaryRange: "₹6L – ₹24L PA (India) / $95k – $165k (Global)",
    coreSkills: ["C (C99/C11)", "Pointers & Memory Layout", "RTOS & Microcontrollers", "Linux System Programming", "GDB & Valgrind"],
    careerMilestones: [
      "Master pointers, memory allocation, struct padding, and bitwise manipulation.",
      "Build device drivers and interrupt service routines for embedded platforms.",
      "Profile and optimize memory usage to prevent leaks, stack overflows, and segfaults.",
      "Design safety-critical embedded firmware and low-latency network packet parsers."
    ],
    interviewPrepFocus: "Pointer arithmetic, volatile qualifier, malloc/free internals, memory alignment, and low-level debugging."
  },
  {
    id: "full-stack",
    title: "Full Stack / Web Developer",
    icon: "💻",
    level: "Junior to Lead",
    salaryRange: "₹6L – ₹25L PA (India) / $85k – $155k (Global)",
    coreSkills: ["HTML5 & CSS3", "JavaScript (ES6+) & TypeScript", "React.js & State Management", "Node.js & Express", "SQL & MySQL", "REST & GraphQL"],
    careerMilestones: [
      "Build accessible, responsive UI with modern CSS Grid and Flexbox.",
      "Master React lifecycle, custom hooks, and state management architectures.",
      "Design robust Node.js backend APIs with streaming, authentication, and database pooling.",
      "Architect full-stack production deployments with Docker, CI/CD, and Redis caching."
    ],
    interviewPrepFocus: "Event loop, closures, Virtual DOM diffing, database normalization, transaction isolation, and system scalability."
  },
  {
    id: "python-backend",
    title: "Python / Backend Engineer",
    icon: "🐍",
    level: "Entry to Staff",
    salaryRange: "₹7L – ₹26L PA (India) / $95k – $160k (Global)",
    coreSkills: ["Python 3.x", "FastAPI / Django", "SQL & Relational Databases", "Concurrency (asyncio, multiprocessing)", "Docker & Microservices"],
    careerMilestones: [
      "Master Python data structures, generators, decorators, and memory profiling.",
      "Design high-throughput REST APIs with asynchronous endpoints.",
      "Optimize MySQL/Postgres queries and connection pools under heavy concurrent traffic.",
      "Architect event-driven microservices using Celery, Redis, and message queues."
    ],
    interviewPrepFocus: "CPython GIL, generators vs iterators, decorators, multiprocessing, and database indexing."
  },
  {
    id: "java-enterprise",
    title: "Java / Enterprise Backend Engineer",
    icon: "☕",
    level: "Associate to Principal",
    salaryRange: "₹8L – ₹28L PA (India) / $105k – $170k (Global)",
    coreSkills: ["Core Java (17/21)", "Spring Boot & Spring Cloud", "JVM Tuning & Garbage Collection", "Multithreading & Concurrency", "MySQL & Hibernate"],
    careerMilestones: [
      "Master JVM internals, memory regions (Heap, Stack, Metaspace), and GC algorithms.",
      "Build resilient microservices with Spring Boot, Spring Security, and distributed tracing.",
      "Handle high-concurrency transactions using ReentrantLock, ExecutorService, and atomic primitives.",
      "Lead enterprise architecture migrations from monoliths to event-driven cloud systems."
    ],
    interviewPrepFocus: "HashMap internal structure, equals/hashCode contracts, JVM GC tuning, and thread synchronization."
  },
  {
    id: "data-structures-algorithms",
    title: "Algorithms & Competitive Problem Solver",
    icon: "🧩",
    level: "Core Engineering Foundation",
    salaryRange: "₹10L – ₹45L+ PA (MAANG / Tier 1 Product Companies)",
    coreSkills: ["Arrays & Strings", "Linked Lists, Stacks, Queues", "Trees, BST, AVL", "Graphs (BFS/DFS/Dijkstra)", "Dynamic Programming", "Big-O Analysis"],
    careerMilestones: [
      "Master Big-O time and space complexity analysis across all data structures.",
      "Solve 300+ LeetCode problems spanning Two-Pointers, Sliding Window, and Tree Traversals.",
      "Master graph traversal patterns (BFS shortest path, DFS topological sort, Union-Find).",
      "Design high-performance in-memory caching and index structures."
    ],
    interviewPrepFocus: "Hash table collision mechanics, BST balancing, BFS vs DFS graph search, and amortized complexity."
  }
];

module.exports = {
  TOPICS,
  QUESTION_BANK,
  CAREER_ROADMAPS
};
