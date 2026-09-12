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
  },

  // ==========================================
  // ADDITIONAL ADVANCED QUESTIONS & CODES
  // ==========================================
  {
    id: "c-04",
    topic: "c",
    topicName: "C Programming",
    role: "Embedded / Systems / C Developer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "How do Function Pointers work in C, and how are they used to implement callbacks and state machines?",
    modelAnswer: `In C, a **function pointer** stores the memory address of executable code (a function in the text segment), allowing functions to be passed as arguments, returned from other functions, and stored in lookup arrays.

**Syntax:** \`return_type (*pointer_name)(parameter_types);\`

**Production Use Cases:**
1. **Callbacks:** Passing a custom comparison function to standard library utilities like \`qsort()\`.
2. **Event-Driven Architectures:** Registering hardware interrupt or GUI click handlers.
3. **Dispatch Tables / State Machines:** Replacing lengthy \`switch/case\` ladders with O(1) array lookup tables.`,
    interviewerIntent: "Assesses understanding of the C memory model (code/text segment), functional dispatch patterns, and callback architectures.",
    answerBlueprint: "Define function pointer syntax with parentheses rule (*fp). Show callback example with qsort. Demonstrate a dispatch table replacing switch-case.",
    codeSnippet: `#include <stdio.h>

// 1. Define operation functions
int add(int a, int b) { return a + b; }
int multiply(int a, int b) { return a * b; }

// 2. Higher-order function receiving function pointer callback
int compute(int x, int y, int (*op)(int, int)) {
    return op(x, y); // Invoke callback
}

int main() {
    // 3. Dispatch Table (Array of Function Pointers)
    int (*operations[2])(int, int) = {add, multiply};

    printf("Add: %d\\n", compute(10, 5, operations[0]));      // 15
    printf("Multiply: %d\\n", compute(10, 5, operations[1])); // 50
    return 0;
}`,
    complexity: "Time: O(1) dispatch lookup | Space: sizeof(pointer) = 8 bytes on 64-bit CPU",
    commonMistakes: "Omitting parentheses around (*op) e.g., int *op(int, int) which declares a function returning an int pointer instead of a function pointer.",
    followUpQuestions: [
      "How do typedefs simplify function pointer syntax in C?",
      "Can you dereference a function pointer or does the C compiler implicitly do it?"
    ],
    tags: ["C", "Function Pointers", "Callbacks", "State Machine", "Architecture"]
  },
  {
    id: "cpp-03",
    topic: "cpp",
    topicName: "C++",
    role: "C++ Software Engineer",
    category: "technical",
    difficulty: "hard",
    experienceLevel: "mid",
    question: "What are Move Semantics and Rvalue References (T&&) in C++11, and how does std::move eliminate expensive deep copies?",
    modelAnswer: `Before C++11, passing or returning large objects (like \`std::vector\` or \`std::string\`) frequently triggered **expensive deep memory allocations and copies**. 

**Move Semantics:**
Allows the resources (pointers to heap memory, file descriptors, socket handles) of a temporary object (an **rvalue**) to be "stolen" or transferred directly into a new object in **O(1) time**, without copying the underlying data.

1. **Lvalue vs Rvalue:**
   - **Lvalue:** An object with an identifiable memory address (e.g. named variables like \`x\`).
   - **Rvalue:** A temporary value that does not persist beyond the expression that created it (e.g. literals like \`42\` or temporary objects returned by value).
2. **Rvalue Reference (\`T&&\`):** A reference type that binds specifically to temporary rvalues.
3. **\`std::move\`:** Does NOT move anything itself! It is simply an unconditional cast converting an lvalue into an rvalue reference (\`static_cast<T&&>(lval)\`), making it eligible for the move constructor.`,
    interviewerIntent: "Checks mastery of modern C++ performance optimization, value categories, and move constructor design.",
    answerBlueprint: "Distinguish lvalues vs rvalues. Explain move constructor stealing pointers. Clarify that std::move is just a static_cast to rvalue reference.",
    codeSnippet: `#include <iostream>
#include <vector>
#include <utility>

class Buffer {
public:
    int* data;
    size_t size;

    Buffer(size_t s) : size(s), data(new int[s]) {}

    // Move Constructor: Steals internal pointer in O(1) time!
    Buffer(Buffer&& other) noexcept : data(other.data), size(other.size) {
        other.data = nullptr; // Leave source in valid destructible state
        other.size = 0;
        std::cout << "Moved in O(1) time without copying memory!\\n";
    }

    ~Buffer() { delete[] data; }
};

int main() {
    Buffer b1(1000000); // 1 Million elements on heap
    Buffer b2 = std::move(b1); // Move constructor called! Zero bytes copied.
    return 0;
}`,
    complexity: "Copy constructor: O(N) allocation and copying | Move constructor: O(1) pointer swap",
    commonMistakes: "Accessing an object after calling std::move on it; forgetting noexcept on move constructors (which prevents std::vector from using them during reallocation).",
    followUpQuestions: [
      "Why should move constructors and move assignment operators always be marked noexcept?",
      "What is Perfect Forwarding (std::forward) and universal references?"
    ],
    tags: ["C++", "Move Semantics", "Rvalue", "std::move", "Modern C++"]
  },
  {
    id: "py-04",
    topic: "python",
    topicName: "Python",
    role: "Python / Backend Engineer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "How do Python Context Managers and the 'with' statement work under the hood?",
    modelAnswer: `The \`with\` statement in Python provides safe, deterministic **resource management** (files, database connections, locks, network sockets) ensuring cleanup operations occur even if exceptions are raised.

**Protocol Mechanism:**
Any class implementing two special dunder methods satisfies the **Context Manager Protocol**:
1. **\`__enter__(self)\`:** Executed before the with-block runs. Its return value is bound to the target variable after the \`as\` keyword.
2. **\`__exit__(self, exc_type, exc_val, exc_tb)\`:** Executed after the with-block completes or raises an exception.
   - If no exception occurred: all three arguments are \`None\`.
   - If an exception occurred: arguments contain exception details. Returning \`True\` suppresses the exception; returning \`False\` (or \`None\`) propagates the exception upward.

**Alternative:** The \`@contextlib.contextmanager\` decorator converts a generator function with a single \`yield\` into a context manager.`,
    interviewerIntent: "Assesses understanding of Python's resource lifecycle, exception safety, and pythonic API design.",
    answerBlueprint: "Explain __enter__ and __exit__ methods. Detail exception arguments in __exit__ and how returning True suppresses errors. Show both class-based and contextlib approaches.",
    codeSnippet: `import time
from contextlib import contextmanager

# 1. Custom Timer Context Manager using Class Protocol
class TimerContext:
    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        duration = time.perf_counter() - self.start
        print(f"Block executed in {duration:.4f}s")
        return False # Propagate any exceptions

# 2. Database Connection Guard using contextlib
@contextmanager
def db_transaction():
    print("BEGIN TRANSACTION")
    try:
        yield "DB_CONNECTION_HANDLE"
        print("COMMIT")
    except Exception as e:
        print(f"ROLLBACK due to: {e}")
        raise`,
    complexity: "Guarantees resource release (O(1)) without manual try-finally blocks.",
    commonMistakes: "Suppressing all exceptions blindly by always returning True in __exit__; forgetting to yield inside a @contextmanager generator.",
    followUpQuestions: [
      "How does ExitStack in contextlib help manage a dynamic number of context managers?",
      "What is an async context manager (__aenter__ and __aexit__) in asyncio?"
    ],
    tags: ["Python", "Context Managers", "with statement", "Resources", "Pythonic"]
  },
  {
    id: "java-03",
    topic: "java",
    topicName: "Java",
    role: "Java Backend Engineer",
    category: "technical",
    difficulty: "hard",
    experienceLevel: "mid",
    question: "What are the differences between synchronized, ReentrantLock, and volatile in Java concurrency?",
    modelAnswer: `Java provides multiple concurrency primitives with distinct synchronization, visibility, and locking guarantees:

1. **\`volatile\` Keyword:**
   - Enforces **Memory Visibility**: reads and writes bypass CPU L1/L2 caches and interact directly with main memory.
   - Prevents instruction reordering (happens-before relationship).
   - **Limitation:** Does **NOT guarantee atomicity**! \`count++\` on a volatile integer still causes race conditions because it is 3 discrete operations (read, increment, write).

2. **\`synchronized\` Keyword (Implicit Monitor Lock):**
   - Built into Java language. Locks on the object's intrinsic monitor.
   - Automatically acquires and releases locks (even on exceptions).
   - **Limitations:** Cannot interrupt waiting threads, cannot set lock timeouts, and lacks fairness options.

3. **\`ReentrantLock\` (java.util.concurrent.locks):**
   - Explicit locking class providing advanced capabilities:
     - \`tryLock(timeout, unit)\`: Prevents deadlocks by giving up if lock is unavailable.
     - \`lockInterruptibly()\`: Responds to thread interruptions.
     - **Fairness:** Can guarantee FIFO lock acquisition among waiting threads.
     - Multiple condition variables via \`newCondition()\`.
   - **Requirement:** Must always be released in a \`finally\` block!`,
    interviewerIntent: "Differentiates basic multi-threading knowledge from advanced lock-free and reentrant concurrency engineering in Java.",
    answerBlueprint: "Compare visibility vs atomicity. Explain why volatile count++ fails. Contrast synchronized (built-in, automatic) with ReentrantLock (tryLock, timeouts, fairness, finally release).",
    codeSnippet: `import java.util.concurrent.locks.ReentrantLock;
import java.util.concurrent.TimeUnit;

public class ConcurrencyDemo {
    private volatile boolean running = true; // Visibility guarantee
    private final ReentrantLock lock = new ReentrantLock(true); // Fair lock
    private int counter = 0;

    public void safeIncrement() {
        try {
            // Attempt to acquire lock for 1 second to avoid deadlock
            if (lock.tryLock(1, TimeUnit.SECONDS)) {
                try {
                    counter++; // Atomically protected
                } finally {
                    lock.unlock(); // Mandatory in finally block!
                }
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}`,
    complexity: "volatile: Zero lock overhead | synchronized: Biased/Lightweight lock optimized by JVM | ReentrantLock: Predictable low overhead under high contention",
    commonMistakes: "Forgetting to unlock ReentrantLock in a finally block (causes permanent deadlock); assuming volatile makes compound operations like counter++ thread-safe.",
    followUpQuestions: [
      "What are AtomicInteger and Compare-And-Swap (CAS) operations in java.util.concurrent.atomic?",
      "What is Lock Striping in ConcurrentHashMap?"
    ],
    tags: ["Java", "Concurrency", "Multithreading", "ReentrantLock", "Volatile"]
  },
  {
    id: "sql-03",
    topic: "sql",
    topicName: "SQL",
    role: "Database Engineer / Backend Developer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "What are SQL Window Functions, and what is the difference between ROW_NUMBER(), RANK(), and DENSE_RANK()?",
    modelAnswer: `**Window Functions** perform calculations across a specified set of table rows related to the current row (a "window"), **without collapsing rows into a single summary row** (unlike \`GROUP BY\`).

**The OVER() Clause:**
- \`PARTITION BY\`: Divides rows into groups (e.g. partition by department).
- \`ORDER BY\`: Sorts rows within each partition.

**ROW_NUMBER() vs RANK() vs DENSE_RANK():**
Suppose two employees in the same department share the exact same salary of $100k, and one employee earns $90k:

1. **\`ROW_NUMBER()\`: Assigns a strict unique sequential integer** to every row regardless of ties:
   - Rankings: \`1, 2, 3\` (ties broken arbitrarily).
2. **\`RANK()\`: Assigns the same rank to ties, but SKIPS subsequent ranks**:
   - Rankings: \`1, 1, 3\` (rank 2 is skipped!).
3. **\`DENSE_RANK()\`: Assigns the same rank to ties, WITHOUT skipping numbers**:
   - Rankings: \`1, 1, 2\` (no gap in rank numbers).`,
    interviewerIntent: "Tests advanced SQL analytical reporting, deduplication queries, and top-N-per-category query patterns.",
    answerBlueprint: "Explain that window functions do not collapse rows. Compare ROW_NUMBER (1,2,3) vs RANK (1,1,3) vs DENSE_RANK (1,1,2) on tie values. Show top-N per department example with CTE.",
    codeSnippet: `-- Find the 2nd Highest Earner in each department using DENSE_RANK()
WITH RankedSalaries AS (
    SELECT 
        employee_id,
        name,
        department_id,
        salary,
        DENSE_RANK() OVER (
            PARTITION BY department_id 
            ORDER BY salary DESC
        ) AS rank_in_dept
    FROM employees
)
SELECT department_id, name, salary
FROM RankedSalaries
WHERE rank_in_dept = 2;`,
    complexity: "Window functions execute during step 6 of query processing (after WHERE and GROUP BY, before final ORDER BY).",
    commonMistakes: "Attempting to filter window functions directly in the WHERE clause (e.g. WHERE ROW_NUMBER() = 1) without using a CTE or subquery.",
    followUpQuestions: [
      "What are LEAD() and LAG() window functions and how are they used in financial delta queries?",
      "What is the ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW window frame specification?"
    ],
    tags: ["SQL", "Window Functions", "DENSE_RANK", "CTEs", "Analytics"]
  },
  {
    id: "mysql-03",
    topic: "mysql",
    topicName: "MySQL",
    role: "Database Administrator / Backend Engineer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "What is the Leftmost Prefix Rule for composite indexes in MySQL, and how do you design multi-column indexes?",
    modelAnswer: `A **composite index** (multi-column index) in MySQL is an index on two or more columns (e.g., \`INDEX(a, b, c)\`).

**The Leftmost Prefix Rule:**
MySQL can use a composite index only if query conditions filter on the columns in order starting from the **leftmost column**:
- \`WHERE a = 1\` -> Uses index on column \`a\`.
- \`WHERE a = 1 AND b = 2\` -> Uses index on columns \`a\` and \`b\`.
- \`WHERE a = 1 AND b = 2 AND c = 3\` -> Uses index on all three columns.
- \`WHERE b = 2 AND c = 3\` -> **CANNOT use the index!** Column \`a\` is missing from the leftmost position.
- \`WHERE a = 1 AND c = 3\` -> Uses index for \`a\`, but cannot use \`c\` directly because \`b\` was skipped.

**Rule of Thumb for Column Order:**
Place columns with **highest selectivity / equality conditions first**, followed by range condition columns (\`>\`, \`<\`, \`BETWEEN\`), because range conditions prevent subsequent index columns from being utilized.`,
    interviewerIntent: "Evaluates production index design and query optimization for high-throughput MySQL applications.",
    answerBlueprint: "Explain B+ Tree sorting in composite indexes. Outline the leftmost rule with valid and invalid WHERE examples. Explain how range conditions stop index traversal.",
    codeSnippet: `-- Create composite index: (status, created_at, user_id)
CREATE INDEX idx_orders_status_date_user ON orders (status, created_at, user_id);

-- FAST: Uses leftmost prefix (status = equality, created_at = range)
SELECT user_id, status FROM orders 
WHERE status = 'SHIPPED' AND created_at >= '2026-01-01';

-- SLOW: Fails Leftmost Rule (status missing -> triggers Full Table Scan)
SELECT * FROM orders WHERE created_at >= '2026-01-01';`,
    complexity: "Composite B+ Tree lookup: O(log N) traversal for valid prefixes | Missing prefix collapses to O(N) table scan",
    commonMistakes: "Creating separate single-column indexes on (a) and (b) expecting MySQL to combine them as effectively as a composite index (a, b).",
    followUpQuestions: [
      "What is Index Condition Pushdown (ICP) in MySQL?",
      "How do prefix indexes work on long VARCHAR or TEXT columns?"
    ],
    tags: ["MySQL", "Indexes", "Leftmost Prefix", "Performance", "Query Optimization"]
  },
  {
    id: "html-03",
    topic: "html",
    topicName: "HTML",
    role: "Frontend Developer",
    category: "technical",
    difficulty: "easy",
    experienceLevel: "entry",
    question: "Compare localStorage, sessionStorage, Cookies, and IndexedDB in modern web browsers.",
    modelAnswer: `Web applications use different client-side storage mechanisms depending on capacity, persistence, and security requirements:

1. **\`localStorage\`:**
   - **Capacity:** ~5MB to 10MB per origin.
   - **Lifetime:** Persistent until explicitly cleared by user or script.
   - **Scope:** Shared across all tabs/windows of the same origin.
   - **Access:** Synchronous JavaScript API.

2. **\`sessionStorage\`:**
   - **Capacity:** ~5MB.
   - **Lifetime:** Scoped to the **current browser tab session**; deleted when tab is closed.
   - **Scope:** Independent per tab.

3. **\`Cookies\`:**
   - **Capacity:** Tiny (~4KB per cookie).
   - **Automatic Transmission:** Sent with **every HTTP request** to the server header.
   - **Security Flags:** Supports \`HttpOnly\` (prevents XSS theft via JavaScript) and \`SameSite=Strict\` / \`Secure\` (prevents CSRF attacks). Essential for session tokens.

4. **\`IndexedDB\`:**
   - **Capacity:** Large (hundreds of MBs to GBs).
   - **Architecture:** Asynchronous, transactional NoSQL object store for large structured datasets, files, and offline PWAs.`,
    interviewerIntent: "Assesses web security awareness (XSS, CSRF), offline storage strategies, and browser capabilities.",
    answerBlueprint: "Compare capacity, expiration, server transmission, and security flags (HttpOnly cookies for JWT vs localStorage XSS risks).",
    codeSnippet: `// 1. Safe localStorage storage with try-catch (guards against Safari Private mode quota errors)
function safeSetItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn("Storage quota exceeded or private browsing restricted", e);
    }
}

// 2. Cookie with security attributes (Server-Side Set-Cookie header)
// Set-Cookie: token=abc123; Secure; HttpOnly; SameSite=Strict; Path=/;`,
    complexity: "localStorage: Synchronous (can block UI thread on large keys) | IndexedDB: Asynchronous non-blocking",
    commonMistakes: "Storing sensitive authentication JWT tokens in localStorage (vulnerable to XSS attacks) instead of secure HttpOnly cookies.",
    followUpQuestions: [
      "Why is storing auth tokens in localStorage vulnerable to XSS?",
      "What is the Storage Quota API in modern browsers?"
    ],
    tags: ["HTML", "Storage", "Cookies", "localStorage", "Web Security"]
  },
  {
    id: "css-03",
    topic: "css",
    topicName: "CSS",
    role: "Frontend / UI Developer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "How is CSS Specificity calculated, and how do Cascade Layers (@layer) solve specificity wars?",
    modelAnswer: `When multiple conflicting CSS rules match the same HTML element, the browser resolves the conflict using **Specificity** and the **Cascade Algorithm**.

**Specificity Hierarchy (The 4-Column Metric):**
1. **Inline Styles (\`style="..."\`):** Score: **(1, 0, 0, 0)**
2. **ID Selectors (\`#header\`):** Score: **(0, 1, 0, 0)**
3. **Class Selectors, Attributes & Pseudo-classes (\`.btn\`, \`[type="text"]\`, \`:hover\`):** Score: **(0, 0, 1, 0)**
4. **Element Selectors & Pseudo-elements (\`div\`, \`p\`, \`::before\`):** Score: **(0, 0, 0, 1)**
5. **Universal (\`*\`), Combinators (\`>\`, \`+\`), and \`:where()\`: Zero specificity (0, 0, 0, 0).

**The Role of \`!important\`:**
Overrides all normal specificity calculations. Overusing it causes unmaintainable "specificity wars".

**Modern Solution: Cascade Layers (\`@layer\` in CSS):**
Allows developers to define the explicit priority order of CSS rules (e.g. reset < framework < utilities) regardless of individual selector specificity!`,
    interviewerIntent: "Tests CSS architecture discipline, avoidance of !important hacks, and modern CSS layout standards.",
    answerBlueprint: "Explain the 4-part tuple (Inline, ID, Class, Element). Show specificity calculation. Introduce @layer as the modern architecture solution.",
    codeSnippet: `/* Specificity Comparison */
/* Score: (0, 0, 0, 1) */
button { background: gray; }

/* Score: (0, 0, 1, 1) - WINS over button */
button.primary { background: blue; }

/* Score: (0, 1, 0, 0) - WINS over button.primary */
#submit-btn { background: red; }

/* Modern Architecture: Cascade Layers eliminate specificity battles */
@layer reset, framework, components, utilities;

@layer components {
    .btn { padding: 12px; } /* Clean, easily overridden by utilities layer */
}`,
    complexity: "Browser calculates specificity during style computation step before layout.",
    commonMistakes: "Using !important to patch CSS bugs; believing 10 classes can override a single ID selector (columns never roll over into higher tiers).",
    followUpQuestions: [
      "What is the difference between :is() and :where() pseudo-classes regarding specificity?",
      "How does CSS inheritance affect specificity calculation?"
    ],
    tags: ["CSS", "Specificity", "Cascade", "Cascade Layers", "BEM"]
  },
  {
    id: "js-03",
    topic: "javascript",
    topicName: "JavaScript",
    role: "Full Stack / JavaScript Developer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "What is the difference between Promise.all(), Promise.allSettled(), Promise.race(), and Promise.any() in JavaScript?",
    modelAnswer: `JavaScript provides 4 concurrency methods to handle collections of Promises in parallel:

1. **\`Promise.all(promises)\` (Fail-Fast):**
   - Resolves when **ALL** promises resolve, returning an array of resolved values.
   - **Rejects immediately** if any single promise rejects, discarding the rest.

2. **\`Promise.allSettled(promises)\` (Resilient Batching):**
   - Waits until **ALL** promises have settled (either resolved OR rejected).
   - Never fails fast. Returns an array of objects: \`{ status: "fulfilled", value }\` or \`{ status: "rejected", reason }\`. Best for independent batch operations.

3. **\`Promise.race(promises)\` (First Settler Wins):**
   - Returns the result of the **first promise to settle** (whether it resolved or rejected).

4. **\`Promise.any(promises)\` (First Success Wins):**
   - Resolves as soon as the **first promise resolves successfully**.
   - If all promises reject, it rejects with an \`AggregateError\`.`,
    interviewerIntent: "Assesses production error handling, network concurrency, and resilience patterns in asynchronous JavaScript.",
    answerBlueprint: "Compare Promise.all (fail fast) vs Promise.allSettled (never fails fast, status array) vs Promise.race (first to settle) vs Promise.any (first to resolve).",
    codeSnippet: `// Practical Example: Promise.allSettled for Resilient Multi-API Aggregation
async function fetchDashboardMetrics() {
    const results = await Promise.allSettled([
        fetch('/api/user/profile').then(r => r.json()),
        fetch('/api/user/analytics').then(r => r.json()),
        fetch('/api/notifications').then(r => r.json())
    ]);

    const profile = results[0].status === 'fulfilled' ? results[0].value : null;
    const analytics = results[1].status === 'fulfilled' ? results[1].value : [];
    
    console.log("Dashboard assembled safely even if notifications API failed!");
    return { profile, analytics };
}`,
    complexity: "All execute asynchronously in parallel without blocking main thread execution.",
    commonMistakes: "Using Promise.all for independent requests where one failing third-party API breaks the entire application screen.",
    followUpQuestions: [
      "What is unhandled promise rejection and how do you handle it in Node.js vs Browser?",
      "How do you implement an async retry utility with exponential backoff in JavaScript?"
    ],
    tags: ["JavaScript", "Promises", "Async", "Concurrency", "Error Handling"]
  },
  {
    id: "node-03",
    topic: "nodejs",
    topicName: "Node.js",
    role: "Backend Engineer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "How does the Express.js Middleware execution pipeline work, and how should centralized error-handling middleware be structured?",
    modelAnswer: `In **Express.js**, middleware functions form a sequential pipeline (Chain of Responsibility pattern) that intercepts and processes incoming HTTP requests before returning a response.

**Execution Flow:**
- Middleware signature: \`function(req, res, next)\`.
- Each middleware can:
  1. Execute code (logging, rate limiting, authentication).
  2. Mutate \`req\` and \`res\` objects (e.g. \`req.user = decodedToken\`).
  3. Terminate the request-response cycle (\`res.status(200).json(...)\`).
  4. Call \`next()\` to pass control to the next middleware in line.

**Error-Handling Middleware:**
- Defined with **strictly 4 arguments**: \`function(err, req, res, next)\`.
- Express inspects the \`fn.length\` parameter count. Only 4-parameter functions are treated as error handlers!
- When any previous middleware calls \`next(err)\`, Express skips all remaining standard middlewares and jumps directly to the error-handling middleware.`,
    interviewerIntent: "Evaluates backend architecture design, error propagation, and defensive security middleware in Express.",
    answerBlueprint: "Explain (req, res, next) pipeline. Detail the strict 4-argument signature of error middleware (err, req, res, next). Show placement at the bottom of the route stack.",
    codeSnippet: `const express = require('express');
const app = express();

// 1. Authentication Middleware
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next(new Error("Unauthorized access")); // Jumps to error handler
    }
    req.user = { id: 101 };
    next(); // Proceed to route
};

// 2. Centralized 4-Argument Error Handler (Placed at very end of app!)
app.use((err, req, res, next) => {
    console.error("[Centralized Error Logger]:", err.message);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || "Internal Server Error"
    });
});`,
    complexity: "Middleware adds negligible O(1) function call overhead per step in the chain.",
    commonMistakes: "Omitting next() in middleware causing client requests to hang indefinitely; omitting the unused next parameter in error handlers (making Express treat it as standard 3-arg middleware).",
    followUpQuestions: [
      "What happens in Express 5 regarding rejected promises in async middleware?",
      "How do helmet and cors middlewares protect Express applications?"
    ],
    tags: ["Node.js", "Express", "Middleware", "Error Handling", "Backend"]
  },
  {
    id: "react-03",
    topic: "react",
    topicName: "React",
    role: "React / Frontend Developer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "What are Custom React Hooks, what rules must they follow, and how do they differ from utility functions?",
    modelAnswer: `A **Custom Hook** in React is a reusable JavaScript function whose name starts with \`"use"\` and that **can invoke other React hooks** (\`useState\`, \`useEffect\`, \`useRef\`, etc.).

**Key Rules of Hooks:**
1. **Only call hooks at the top level:** Never call hooks inside loops, conditions (\`if\`), or nested functions. This ensures hooks execute in the exact same order on every render.
2. **Only call hooks from React function components or custom hooks:** Never from regular vanilla JS functions.

**Custom Hooks vs. Utility Functions:**
- **Utility Function:** A plain pure JavaScript function that calculates and returns a value (e.g., date formatting, mathematical math). It cannot hold component state.
- **Custom Hook:** Encapsulates **stateful logic** and component lifecycle side-effects, allowing stateful behavior to be shared cleanly across multiple components without higher-order component (HOC) wrappers.`,
    interviewerIntent: "Assesses clean code component decomposition, modular state architecture, and adherence to React Hook rules.",
    answerBlueprint: "Explain custom hook naming convention ('use'). Enumerate the 2 Rules of Hooks. Contrast stateful custom hooks with plain utility functions. Show reusable useDebounce example.",
    codeSnippet: `import { useState, useEffect } from 'react';

// Reusable Custom Hook: useDebounce
function useDebounce(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer); // Cleanup on rapid changes!
    }, [value, delay]);

    return debouncedValue;
}

// Usage in Component:
function SearchBox() {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 400);

    useEffect(() => {
        if (debouncedQuery) {
            console.log("Searching API for debounced:", debouncedQuery);
        }
    }, [debouncedQuery]);

    return <input value={query} onChange={e => setQuery(e.target.value)} />;
}`,
    complexity: "Custom hooks share stateful logic, not state itself: each component invocation maintains independent state.",
    commonMistakes: "Calling hooks conditionally (e.g. if (user) useEffect(...)); expecting custom hook instances to share global singleton state without Context.",
    followUpQuestions: [
      "How do custom hooks facilitate unit testing with React Testing Library (renderHook)?",
      "What is the difference between useId and standard uuid libraries in React 18?"
    ],
    tags: ["React", "Custom Hooks", "useDebounce", "Architecture", "State"]
  },
  {
    id: "ds-04",
    topic: "ds",
    topicName: "Data Structures (DS)",
    role: "Software Engineer / Algorithms",
    category: "technical",
    difficulty: "hard",
    experienceLevel: "mid",
    question: "Compare Breadth-First Search (BFS) and Depth-First Search (DFS) in graphs, and when is BFS guaranteed to find the shortest path?",
    modelAnswer: `**BFS** and **DFS** are the two fundamental algorithms for traversing or searching tree and graph data structures:

1. **Breadth-First Search (BFS):**
   - **Data Structure:** Uses a **Queue (FIFO)**.
   - **Exploration Pattern:** Explores level-by-level, visiting all immediate neighbor nodes before moving to the next level of depth.
   - **Shortest Path Guarantee:** In an **unweighted graph** (or graph where all edges have equal weight), BFS is **guaranteed to find the shortest path** (minimum number of edges) between source and target!

2. **Depth-First Search (DFS):**
   - **Data Structure:** Uses a **Stack (LIFO)** or **Recursion**.
   - **Exploration Pattern:** Plunges as deep as possible along each branch before backtracking.
   - **Optimal For:** Topological sorting, detecting cycles in directed graphs, solving mazes, and connected components.`,
    interviewerIntent: "Validates graph theory fundamentals, algorithm selection trade-offs, and queue vs stack memory dynamics.",
    answerBlueprint: "Contrast Queue (BFS) vs Stack/Recursion (DFS). Explain why BFS guarantees shortest path in unweighted graphs. Detail time O(V + E) and space complexity.",
    codeSnippet: `// BFS Shortest Path in an Unweighted Graph
function shortestPathBFS(graph, startNode, targetNode) {
    const queue = [[startNode, [startNode]]]; // [currentNode, pathSoFar]
    const visited = new Set([startNode]);

    while (queue.length > 0) {
        const [node, path] = queue.shift();

        if (node === targetNode) {
            return { distance: path.length - 1, path };
        }

        for (const neighbor of (graph[node] || [])) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push([neighbor, [...path, neighbor]]);
            }
        }
    }
    return null; // Target unreachable
}`,
    complexity: "Time: O(V + E) where V = vertices, E = edges | Space: O(V) for visited set and queue",
    commonMistakes: "Using DFS to find the shortest path in an unweighted graph; forgetting to track visited nodes which causes infinite loops in cyclic graphs.",
    followUpQuestions: [
      "What algorithm is used for shortest path in weighted graphs with non-negative weights (Dijkstra's Algorithm)?",
      "What is Bidirectional BFS and how does it reduce the search space from O(b^d) to O(b^(d/2))?"
    ],
    tags: ["Data Structures", "Graphs", "BFS", "DFS", "Shortest Path", "Algorithms"]
  },
  {
    id: "cpp-04",
    topic: "cpp",
    topicName: "C++",
    role: "C++ Systems / Core Engineer",
    category: "technical",
    difficulty: "hard",
    experienceLevel: "senior",
    question: "What is RAII (Resource Acquisition Is Initialization), how does the Rule of 5 (and Rule of 0) guarantee exception safety, and what are C++20 Concepts?",
    modelAnswer: `**RAII (Resource Acquisition Is Initialization)** is the central design idiom of modern C++:
- Resources (heap memory, file handles, mutex locks, network sockets) are **acquired in the constructor** and **released in the destructor**.
- Because destructors are guaranteed to be called during **stack unwinding** when an exception is thrown, RAII completely eliminates manual cleanup and guarantees zero resource leaks.

**The Rule of 5 vs. Rule of 0:**
- **Rule of 5:** If a class directly manages a raw resource and customizes any of the following 5 special member functions, it should explicitly declare all 5:
  1. Destructor (\`~T()\`)
  2. Copy Constructor (\`T(const T&)\`)
  3. Copy Assignment Operator (\`T& operator=(const T&)\`)
  4. Move Constructor (\`T(T&&)\`)
  5. Move Assignment Operator (\`T& operator=(T&&)\`)
- **Rule of 0:** Design classes using modern RAII wrappers (\`std::unique_ptr\`, \`std::vector\`, \`std::string\`) so the class needs **none** of the 5 custom methods—the compiler-generated defaults handle everything safely.

**C++20 Concepts:**
Concepts provide compile-time predicates to constrain template parameters, replacing obscure SFINAE / \`std::enable_if\` with readable compiler diagnostics.`,
    interviewerIntent: "Assesses modern C++ resource management, exception safety guarantees, and contemporary C++20 template constraints.",
    answerBlueprint: "1) Define RAII and stack unwinding. 2) Detail the Rule of 5 special member functions. 3) Contrast with Rule of 0 using smart pointers. 4) Explain C++20 concepts with a constrained template example.",
    codeSnippet: `// 1. RAII Lock Guard Example
void processData(std::mutex& mtx) {
    std::lock_guard<std::mutex> lock(mtx); // Acquired in constructor
    // If an exception throws here, lock is ALWAYS released in destructor!
}

// 2. C++20 Concept Constraining Numeric Types
template<typename T>
concept Numeric = std::is_arithmetic_v<T>;

template<Numeric T>
T calculateAverage(T a, T b) {
    return (a + b) / 2;
}`,
    complexity: "Time: O(1) construction and destruction overhead | Space: Zero overhead abstraction",
    commonMistakes: "Violating the Rule of 5 by writing a custom destructor that frees memory but forgetting to delete or define the copy constructor, leading to double-free errors.",
    followUpQuestions: [
      "What are the three levels of Exception Safety (Basic, Strong, and No-throw / noexcept)?",
      "How does copy-and-swap idiom simplify implementing copy and move assignment operators?"
    ],
    tags: ["C++", "RAII", "Rule of 5", "Rule of 0", "Concepts", "Memory Safety"]
  },
  {
    id: "java-04",
    topic: "java",
    topicName: "Java",
    role: "Java Backend / Enterprise Architect",
    category: "technical",
    difficulty: "hard",
    experienceLevel: "senior",
    question: "How does ConcurrentHashMap achieve thread-safety without locking the entire table in Java, and how does it compare to Collections.synchronizedMap?",
    modelAnswer: `In concurrent Java backend applications, managing high-throughput thread-safe map access is critical:

**1. Collections.synchronizedMap(Map):**
- Uses a single shared mutex lock on the entire backing map instance for every read and write operation.
- **Bottleneck:** Severe thread contention under high concurrency, as readers and writers block each other.

**2. ConcurrentHashMap Internals (Java 8+):**
- **Lock-Free Reads:** Read operations (\`get()\`) are completely non-blocking and lock-free, utilizing \`volatile\` node value and next-pointer references.
- **CAS (Compare-And-Swap) for Empty Buckets:** When inserting into an empty bucket, it uses hardware-level CAS (\`Unsafe.compareAndSwapObject\`) without taking any monitor lock.
- **Synchronized Node Locking:** When a collision occurs (the bucket already has nodes), it locks **only the head node** of that specific bucket using Java's \`synchronized(node)\`.
- **TreeBin Optimization:** If a bucket's collision chain exceeds 8 nodes and capacity >= 64, it transforms into a Red-Black Tree for O(log N) worst-case lookup.`,
    interviewerIntent: "Evaluates multi-threading concurrency expertise, lock granularity, CAS mechanics, and Java memory model fundamentals.",
    answerBlueprint: "Compare coarse-grained whole-map locking vs bucket-level locking. Explain volatile reads, CAS for uninitialized buckets, synchronized per bucket head, and treeification.",
    codeSnippet: `// High-concurrency safe counter using ConcurrentHashMap
ConcurrentHashMap<String, LongAdder> frequencyMap = new ConcurrentHashMap<>();

void recordHit(String endpoint) {
    // computeIfAbsent is atomic per bucket
    frequencyMap.computeIfAbsent(endpoint, k -> new LongAdder()).increment();
}

long getHits(String endpoint) {
    LongAdder adder = frequencyMap.get(endpoint);
    return adder != null ? adder.sum() : 0L;
}`,
    complexity: "get(): O(1) lock-free | put(): O(1) locking only the specific bucket head",
    commonMistakes: "Assuming ConcurrentHashMap prohibits null keys or values (it throws NullPointerException on null keys/values to avoid ambiguous get results in concurrent environments).",
    followUpQuestions: [
      "Why does ConcurrentHashMap reject null keys and null values while HashMap allows them?",
      "How does ConcurrentHashMap calculate size() without stopping the world?"
    ],
    tags: ["Java", "Multithreading", "ConcurrentHashMap", "CAS", "Locking", "Concurrency"]
  },
  {
    id: "sql-04",
    topic: "sql",
    topicName: "SQL",
    role: "Data Architect / Backend SQL Engineer",
    category: "technical",
    difficulty: "hard",
    experienceLevel: "senior",
    question: "What are Recursive Common Table Expressions (Recursive CTEs) in SQL, how do they work, and how do you use them to query hierarchical org charts or graph data?",
    modelAnswer: `A **Recursive Common Table Expression (Recursive CTE)** is an iterative SQL query that references itself to traverse hierarchical, parent-child, or graph-structured relational data (such as organization reporting chains, threaded comment trees, or bill-of-materials).

**Core Structure of a Recursive CTE:**
1. **Anchor Member:** The base query that executes first to establish the starting result set (e.g. finding the CEO or top-level root nodes where \`manager_id IS NULL\`).
2. **UNION ALL:** Combines the anchor result with the recursive iterations.
3. **Recursive Member:** Joins the CTE back to the underlying table on the parent-child relationship (e.g. joining on \`e.manager_id = cte.emp_id\`). It repeats automatically until the join yields an empty set.
4. **Termination Condition:** Stops when no new rows are produced. Modern SQL engines also provide recursion depth limits (e.g. \`MAXRECURSION\`) to prevent infinite loops from cycles in data.`,
    interviewerIntent: "Tests advanced SQL data modeling, recursion mechanics, tree traversal in relational engines, and prevention of infinite recursion.",
    answerBlueprint: "1) Define Recursive CTE and explain why it's needed for trees/hierarchies. 2) Break down the 3 components (Anchor, UNION ALL, Recursive member). 3) Provide clear Org Chart query showing employee hierarchy depth. 4) Discuss cycle detection / MAXRECURSION.",
    codeSnippet: `-- Org Chart Traversal: Finding All Reports Under CEO with Hierarchy Level
WITH RECURSIVE OrgHierarchy AS (
    -- 1. Anchor Member: Top of hierarchy (CEO)
    SELECT emp_id, name, manager_id, 1 AS depth_level
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    -- 2. Recursive Member: Join next level subordinates
    SELECT e.emp_id, e.name, e.manager_id, o.depth_level + 1
    FROM employees e
    INNER JOIN OrgHierarchy o ON e.manager_id = o.emp_id
)
SELECT emp_id, name, depth_level
FROM OrgHierarchy
ORDER BY depth_level, name;`,
    complexity: "Time: O(V + E) where V = rows in hierarchy, E = relationships | Space: O(depth) recursion stack buffer",
    commonMistakes: "Using UNION instead of UNION ALL (which incurs expensive duplicate elimination on every recursion step); forgetting cycle guards in cyclic graph data.",
    followUpQuestions: [
      "What happens if employee data contains a circular reference (A reports to B, B reports to A) in a Recursive CTE?",
      "How do you construct breadcrumb paths (e.g. 'CEO > VP > Director > Lead') within a recursive CTE?"
    ],
    tags: ["SQL", "Recursive CTE", "Hierarchical Data", "Trees", "Advanced SQL"]
  },
  {
    id: "mysql-04",
    topic: "mysql",
    topicName: "MySQL",
    role: "MySQL / Database Administrator",
    category: "technical",
    difficulty: "hard",
    experienceLevel: "senior",
    question: "How does MySQL InnoDB implement MVCC (Multi-Version Concurrency Control), Redo Logs (WAL) vs Undo Logs, and how are Deadlocks detected and resolved?",
    modelAnswer: `InnoDB is an ACID-compliant transactional storage engine powered by three critical architectural subsystems:

**1. MVCC (Multi-Version Concurrency Control):**
- Allows **non-blocking reads**: Readers never block writers, and writers never block readers.
- When a row is modified, InnoDB doesn't overwrite it in place immediately. Instead, it writes the previous version of the row to the **Undo Log** and updates the hidden \`DB_ROLL_PTR\` (roll pointer) and \`DB_TRX_ID\` (transaction ID) in the clustered index.
- Readers create a **Read View** at transaction start (under REPEATABLE READ) to see a consistent snapshot by traversing the undo chain.

**2. Redo Log vs. Undo Log:**
- **Redo Log (Write-Ahead Logging - WAL):** Ensures **Durability (D in ACID)** and crash recovery. Changes are written sequentially to \`ib_logfile\` on disk before dirty buffer pool pages are flushed. If the server loses power, InnoDB replays the redo log upon reboot.
- **Undo Log:** Ensures **Atomicity (A in ACID)** and rollback capability. If a transaction fails or issues \`ROLLBACK\`, old values are restored from the undo log.

**3. Deadlock Detection & Resolution:**
- Occurs when two transactions hold locks the other needs in a circular wait (e.g. Tx1 locks row A and waits for row B; Tx2 locks row B and waits for row A).
- InnoDB's background engine runs **Deadlock Detection** via a wait-for graph: it immediately detects the cycle, picks the transaction with the smallest number of inserted/updated rows as the **victim**, rolls it back, and returns error \`1213: Deadlock found when trying to get lock; try restarting transaction\`.`,
    interviewerIntent: "Assesses enterprise MySQL internals, high-concurrency transaction safety, crash recovery guarantees, and lock contention diagnostics.",
    answerBlueprint: "1) Explain MVCC and non-blocking reads using Undo Log snapshot chains. 2) Contrast Redo Log (crash durability / WAL) vs Undo Log (rollback / MVCC). 3) Explain deadlock detection with wait-for graph and why the smaller transaction is rolled back.",
    codeSnippet: `-- Diagnosing Deadlocks and Transaction Locks in MySQL
-- 1. Inspect most recent deadlock details from InnoDB Monitor
SHOW ENGINE INNODB STATUS\\G

-- 2. Inspect active transactions and lock waits in Performance Schema
SELECT 
    r.trx_id waiting_trx_id,
    r.trx_mysql_thread_id waiting_thread,
    b.trx_id blocking_trx_id,
    b.trx_mysql_thread_id blocking_thread,
    b.trx_query blocking_query
FROM performance_schema.data_lock_waits w
JOIN information_schema.innodb_trx b ON b.trx_id = w.blocking_engine_transaction_id
JOIN information_schema.innodb_trx r ON r.trx_id = w.requesting_engine_transaction_id;`,
    complexity: "MVCC read: O(1) buffer pool lookup | Deadlock check: O(V + E) cycle detection in lock wait graph",
    commonMistakes: "Confusing Redo Log with Undo Log; long-running transactions causing massive Undo Tablespace bloat because old undo versions cannot be purged.",
    followUpQuestions: [
      "Why does REPEATABLE READ in MySQL prevent Phantom Reads using Next-Key Locks (Record Lock + Gap Lock)?",
      "What is the doublewrite buffer in InnoDB and how does it prevent partial page writes on operating system crashes?"
    ],
    tags: ["MySQL", "InnoDB", "MVCC", "Redo Log", "Undo Log", "Deadlocks", "ACID"]
  },
  {
    id: "html-04",
    topic: "html",
    topicName: "HTML",
    role: "Frontend / Web Performance Engineer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "Explain the Critical Rendering Path: What happens between requesting an HTML file and rendering pixels, and how do async, defer, and preload optimize it?",
    modelAnswer: `The **Critical Rendering Path (CRP)** is the sequence of steps the browser takes to convert HTML, CSS, and JavaScript into actual screen pixels:

**The 5 Core Steps:**
1. **DOM Construction:** Browser parses raw HTML bytes into tokens, nodes, and builds the Document Object Model tree.
2. **CSSOM Construction:** Browser parses external/internal CSS and builds the CSS Object Model tree. CSS is render-blocking!
3. **Render Tree:** Combines DOM and CSSOM, computing styles for visible elements (ignores \`display: none\`).
4. **Layout (Reflow):** Computes exact geometric coordinates and pixel dimensions for every element on the viewport.
5. **Paint & Composite (Repaint):** Converts render nodes into visual bitmap layers and composites them to the GPU screen buffer.

**Optimizing Scripts & Assets:**
- **Standard \`<script>\`:** Parser-blocking. Halts HTML parsing, downloads script, executes immediately.
- **\`<script defer>\`:** Downloads in background without blocking parser; executes in document order **after** DOM parsing is complete.
- **\`<script async>\`:** Downloads in background; executes immediately as soon as download finishes (independent of order).
- **\`<link rel="preload">\`:** Informs browser to fetch critical fonts, hero images, or CSS high-priority before discovery.`,
    interviewerIntent: "Assesses web performance, Core Web Vitals (LCP, FID, CLS), browser internals, and script loading strategies.",
    answerBlueprint: "Walk through DOM -> CSSOM -> Render Tree -> Layout -> Paint. Explain render-blocking nature of CSS. Contrast async vs defer vs preload.",
    codeSnippet: `<!-- Performance-Optimized Document Head -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <!-- Preload critical hero font -->
  <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
  
  <!-- Critical CSS inlined or linked -->
  <link rel="stylesheet" href="/styles.css" />
  
  <!-- Non-blocking Defer for Application Code -->
  <script defer src="/app.js"></script>
  
  <!-- Independent Analytics Script -->
  <script async src="https://analytics.example.com/tag.js"></script>
</head>`,
    complexity: "HTML parsing: O(N) tokens | Layout: O(N log N) tree calculation",
    commonMistakes: "Putting heavy parser-blocking scripts in <head> without async or defer; causing layout thrashing by alternating DOM reads and writes in JS.",
    followUpQuestions: [
      "What is Layout Thrashing (Forced Synchronous Layout) and how do you avoid it?",
      "What is the difference between <link rel='preload'>, <link rel='prefetch'>, and <link rel='preconnect'>?"
    ],
    tags: ["HTML", "Critical Rendering Path", "async", "defer", "preload", "Performance"]
  },
  {
    id: "css-04",
    topic: "css",
    topicName: "CSS",
    role: "Frontend Engineer / UI Developer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "mid",
    question: "What is a CSS Stacking Context, what triggers one, and why does setting z-index: 99999 not always bring an element to the front?",
    modelAnswer: `A **Stacking Context** is a three-dimensional conceptualization of HTML elements along an imaginary z-axis perpendicular to the viewport.

**Why \`z-index: 99999\` Fails:**
The \`z-index\` property **only compares elements within the same stacking context**! If an element is nested inside a parent with a lower stacking context, no matter how high its \`z-index\` is, it can never appear in front of an element in a higher sibling stacking context:
- *Child with z-index: 99999 inside Parent with z-index: 1 will ALWAYS sit behind a Sibling with z-index: 2!*

**Common Triggers of a New Stacking Context:**
1. Root element of the document (\`<html>\`).
2. Element with \`position: absolute/relative\` and \`z-index\` value other than \`auto\`.
3. Element with \`position: fixed\` or \`position: sticky\`.
4. Element with \`opacity\` less than 1.
5. Element with \`transform\`, \`filter\`, \`perspective\`, or \`backdrop-filter\` other than \`none\`.
6. Element with \`isolation: isolate\` (the cleanest modern CSS property to reset stacking boundaries).`,
    interviewerIntent: "Tests deep CSS rendering mechanics, layering bugs, and clean layout isolation.",
    answerBlueprint: "Explain 3D z-axis model. Clarify that z-index is local to its stacking context. Name top triggers (opacity, transform, fixed, isolation). Show isolation: isolate.",
    codeSnippet: `/* Fix Stacking Leak using isolation: isolate */
.modal-layer {
    position: fixed;
    inset: 0;
    z-index: 1000;
}

.card-container {
    /* Creates a local, isolated stacking boundary */
    isolation: isolate; 
    transform: scale(1.0); /* Also creates stacking context */
}

.card-tooltip {
    position: absolute;
    z-index: 99999; /* Trapped inside .card-container's context! */
}`,
    complexity: "Compositing layer calculations: Handled by GPU compositing thread in O(layers)",
    commonMistakes: "Incrementing z-index to arbitrary numbers like 9999999 instead of debugging the parent stacking context; forgetting that CSS transforms create a stacking context.",
    followUpQuestions: [
      "How does CSS isolation: isolate prevent z-index bugs in design systems and component libraries?",
      "What is the difference between reflow and repaint in CSS performance?"
    ],
    tags: ["CSS", "Stacking Context", "z-index", "isolation", "Layout"]
  },
  {
    id: "javascript-04",
    topic: "javascript",
    topicName: "JavaScript",
    role: "JavaScript / Frontend Engineer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "What is the practical difference between Debouncing and Throttling, and how do you implement both from scratch?",
    modelAnswer: `**Debouncing** and **Throttling** are two rate-limiting techniques used to control how frequently a callback function executes in response to high-frequency events (like \`window.onresize\`, \`scroll\`, or \`input\` typing):

1. **Debounce:**
   - **Mechanism:** Postpones function execution until after a specified period of **inactivity** has elapsed. If the event fires again before the timer expires, the previous timer is cancelled and restarted.
   - **Ideal Use Cases:** Live search auto-complete, window resize layout recalculation, form autosave after user stops typing.

2. **Throttle:**
   - **Mechanism:** Guarantees that the function executes at most **once every X milliseconds**, regardless of how many times the event is triggered.
   - **Ideal Use Cases:** Infinite scroll pagination check on \`scroll\`, drag-and-drop mousemove updates, video player progress trackers.`,
    interviewerIntent: "Tests closure mastery, asynchronous timers (\`setTimeout\`), performance optimization, and custom utility engineering.",
    answerBlueprint: "Define debounce (wait for silence) vs throttle (constant regular intervals). Provide clear, closure-based implementations of both with clearTimeout and timestamps.",
    codeSnippet: `// 1. Debounce Implementation
function debounce(fn, delay = 300) {
    let timerId = null;
    return function (...args) {
        if (timerId) clearTimeout(timerId);
        timerId = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

// 2. Throttle Implementation
function throttle(fn, interval = 300) {
    let lastTime = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastTime >= interval) {
            lastTime = now;
            fn.apply(this, args);
        }
    };
}`,
    complexity: "Time: O(1) invocation overhead | Space: O(1) memory for timer handle and timestamp closures",
    commonMistakes: "Losing the 'this' context when invoking the wrapped function; forgetting to return a cleanup cancel method for component unmounting in React.",
    followUpQuestions: [
      "How do you implement leading vs trailing options in a production debounce function?",
      "Why is requestAnimationFrame preferred over throttling for DOM scroll/animation loops?"
    ],
    tags: ["JavaScript", "Debounce", "Throttle", "Closures", "Performance", "Timers"]
  },
  {
    id: "nodejs-04",
    topic: "nodejs",
    topicName: "Node.js",
    role: "Node.js / Distributed Systems Engineer",
    category: "technical",
    difficulty: "hard",
    experienceLevel: "senior",
    question: "Compare Node.js Clustering, Worker Threads, and Child Processes: When should you use each to scale CPU-bound or multi-core workloads?",
    modelAnswer: `Because Node.js runs JavaScript on a single-threaded event loop, heavy CPU-intensive operations (image compression, cryptography, PDF rendering) can block incoming I/O. Node provides three distinct scaling models:

1. **Clustering (\`cluster\` module):**
   - **Architecture:** Spawns multiple identical OS processes running the same server code, sharing the same listening port (via master process round-robin).
   - **Memory:** Shared-nothing; each worker has its own independent V8 heap, libuv loop, and 30-50MB memory footprint.
   - **Best For:** Scaling HTTP web servers across all physical CPU cores on a single machine.

2. **Worker Threads (\`worker_threads\` module):**
   - **Architecture:** Spawns multiple OS threads within the **same process**, running isolated V8 isolates with separate event loops.
   - **Memory:** Can share memory directly via \`SharedArrayBuffer\` and \`Atomics\` without serialization overhead.
   - **Best For:** Heavy in-memory CPU tasks (data parsing, AI tokenization, matrix math) inside a single server instance.

3. **Child Processes (\`child_process\` module):**
   - **Architecture:** Spawns independent sub-processes via \`spawn\`, \`exec\`, or \`fork\`, communicating via IPC pipes or stdin/stdout.
   - **Best For:** Executing external binaries, shell commands (e.g., ffmpeg, git), or isolated micro-scripts.`,
    interviewerIntent: "Evaluates production multi-core architecture, memory isolation vs sharing, process orchestration, and avoidance of event loop starvation.",
    answerBlueprint: "Compare Cluster (multiple processes on same port), Worker Threads (threads inside one process with SharedArrayBuffer), and Child Process (external CLI/scripts).",
    codeSnippet: `// Worker Thread Example for Heavy CPU Computation
// main.js
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
    const worker = new Worker(__filename, { workerData: { num: 42 } });
    worker.on('message', result => console.log("Calculated Fibonacci:", result));
    worker.on('error', err => console.error(err));
} else {
    // Worker Thread Logic (Runs off the main event loop!)
    function fib(n) { return n <= 1 ? n : fib(n - 1) + fib(n - 2); }
    parentPort.postMessage(fib(workerData.num));
}`,
    complexity: "Cluster: O(Cores) separate processes | Worker Threads: O(Threads) with low shared memory overhead",
    commonMistakes: "Using Worker Threads for I/O operations (libuv already handles I/O asynchronously); mutating shared memory without Atomics leading to race conditions.",
    followUpQuestions: [
      "How does PM2 utilize Node's cluster mode in containerized production deployments?",
      "What are the security implications of using child_process.exec() with untrusted user input?"
    ],
    tags: ["Node.js", "Cluster", "Worker Threads", "Concurrency", "Scaling", "CPU"]
  },
  {
    id: "react-04",
    topic: "react",
    topicName: "React",
    role: "Senior Frontend / React Architect",
    category: "technical",
    difficulty: "hard",
    experienceLevel: "senior",
    question: "What is Concurrent Mode in React 18, and how do useTransition and useDeferredValue prevent UI freezing during heavy state updates?",
    modelAnswer: `Prior to React 18, rendering was **synchronous and uninterruptible**: once React started rendering a large component tree, it could not yield execution back to the browser until the entire tree finished rendering. If a render took 100ms, user inputs and button clicks froze.

**React 18 Concurrent Rendering:**
Concurrent React allows renders to be **interrupted, paused, and resumed in the background**. If urgent user input occurs (e.g. typing), React pauses the non-urgent background render, handles the user interaction, and resumes.

**Key Hooks:**
1. **\`useTransition()\`:**
   - Marks a state update as a non-urgent transition (\`startTransition(() => setSearch(val))\`).
   - Urgent state updates (like updating input value) execute immediately, while the expensive filtered list renders in the background with an \`isPending\` loading indicator.
2. **\`useDeferredValue(value)\`:**
   - Defers updating a derived value until the urgent render completes, similar to debouncing but without arbitrary millisecond delays (React updates it as fast as CPU permits).`,
    interviewerIntent: "Assesses understanding of modern React 18 concurrent mechanics, user perceived responsiveness, and advanced render scheduling.",
    answerBlueprint: "Contrast synchronous uninterruptible rendering with interruptible concurrent rendering. Explain useTransition for actions and useDeferredValue for values.",
    codeSnippet: `import { useState, useTransition, useDeferredValue } from 'react';

function ProductCatalog({ allProducts }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isPending, startTransition] = useTransition();

    const handleSearch = (e) => {
        // Urgent update: Keep input field responsive and snappy!
        setSearchTerm(e.target.value);
    };

    // Defer the heavy list calculation
    const deferredSearch = useDeferredValue(searchTerm);
    const filteredProducts = allProducts.filter(p => 
        p.name.toLowerCase().includes(deferredSearch.toLowerCase())
    );

    return (
        <div>
            <input value={searchTerm} onChange={handleSearch} placeholder="Search..." />
            {isPending && <span className="spinner">Updating catalog...</span>}
            <ProductList items={filteredProducts} />
        </div>
    );
}`,
    complexity: "Rendering yields to the browser main thread via MessageChannel / scheduler cooperative multitasking.",
    commonMistakes: "Wrapping standard controlled input updates in startTransition (causing laggy keystrokes); using useTransition where a simple debounce is sufficient.",
    followUpQuestions: [
      "What is the difference between React 18 Automatic Batching and React 17 batching?",
      "How does React Server Components (RSC) complement concurrent rendering?"
    ],
    tags: ["React", "React 18", "Concurrent Mode", "useTransition", "useDeferredValue", "Performance"]
  },
  {
    id: "ds-05",
    topic: "ds",
    topicName: "Data Structures (DS)",
    role: "Software Engineer / Algorithms",
    category: "technical",
    difficulty: "hard",
    experienceLevel: "mid",
    question: "How do you design and implement a Least Recently Used (LRU) Cache with O(1) time complexity for both get() and put() operations?",
    modelAnswer: `An **LRU Cache** evicts the least recently accessed item when capacity is reached.

**Optimal Architecture: Hash Map + Doubly Linked List:**
1. **Hash Map (Key -> Node Pointer):** Provides **O(1)** lookup to locate any node in memory instantly.
2. **Doubly Linked List (Head <-> Tail):**
   - **Head:** Most Recently Used (MRU) items.
   - **Tail:** Least Recently Used (LRU) items.
   - Allows **O(1)** insertion at the head, **O(1)** deletion of any arbitrary node (because each node has \`prev\` and \`next\` pointers), and **O(1)** eviction from the tail.

**Operation Mechanics:**
- **get(key):** If key exists in map, move the node to the head of the linked list (marking it recently used) and return its value. O(1).
- **put(key, value):** If key exists, update value and move to head. If new, create node and prepend to head; if capacity exceeded, remove tail node and delete from hash map. O(1).`,
    interviewerIntent: "Classic MAANG interview question. Assesses composite data structure design, pointer manipulation, and algorithmic efficiency.",
    answerBlueprint: "Explain why Array (O(N) shift) or plain Hash Map is insufficient. Show HashMap + Doubly Linked List with dummy head and tail nodes to eliminate edge cases.",
    codeSnippet: `// Node for Doubly Linked List
class Node {
    constructor(key, val) {
        this.key = key;
        this.val = val;
        this.prev = null;
        this.next = null;
    }
}

class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.map = new Map();
        // Dummy head and tail to eliminate null pointer edge checks
        this.head = new Node(0, 0);
        this.tail = new Node(0, 0);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    _remove(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    _add(node) {
        node.next = this.head.next;
        node.prev = this.head;
        this.head.next.prev = node;
        this.head.next = node;
    }

    get(key) {
        if (!this.map.has(key)) return -1;
        const node = this.map.get(key);
        this._remove(node);
        this._add(node); // Move to MRU head
        return node.val;
    }

    put(key, value) {
        if (this.map.has(key)) {
            this._remove(this.map.get(key));
        }
        const newNode = new Node(key, value);
        this._add(newNode);
        this.map.set(key, newNode);

        if (this.map.size > this.capacity) {
            const lru = this.tail.prev;
            this._remove(lru);
            this.map.delete(lru.key);
        }
    }
}`,
    complexity: "Time: O(1) for both get() and put() | Space: O(Capacity) for Map and Doubly Linked List nodes",
    commonMistakes: "Using a singly linked list (requires O(N) to find the previous node for deletion); failing to delete the evicted node key from the hash map.",
    followUpQuestions: [
      "How does the JavaScript Map object naturally maintain insertion order to implement a simpler LRU?",
      "How would you make this LRU Cache thread-safe in a multi-threaded C++ or Java application?"
    ],
    tags: ["Data Structures", "LRU Cache", "Doubly Linked List", "Hash Map", "Design", "O(1)"]
  },
  {
    id: "c-05",
    topic: "c",
    topicName: "C Programming",
    role: "Embedded / Systems Firmware Engineer",
    category: "technical",
    difficulty: "hard",
    experienceLevel: "senior",
    question: "How does Memory Alignment and Structure Padding work in C, what is #pragma pack, and how do Bitwise Masking operations control hardware registers?",
    modelAnswer: `Modern CPU architectures read memory in words (e.g. 4-byte or 8-byte chunks). Accessing unaligned addresses requires extra CPU bus cycles or triggers a hardware alignment fault on architectures like ARM.

**1. Structure Padding & Alignment Rules:**
- The compiler automatically inserts invisible **padding bytes** between struct members so each variable aligns with an address that is a multiple of its \`sizeof(type)\`.
- The overall size of the struct is always padded to be a multiple of the largest member's alignment requirement.
- **Example:**
  \`struct Foo { char a; int b; char c; };\`
  Layout: \`char a\` (1 byte) + 3 bytes padding + \`int b\` (4 bytes) + \`char c\` (1 byte) + 3 bytes padding = **12 bytes**!
  Reordered: \`struct Bar { int b; char a; char c; };\` = 4 + 1 + 1 + 2 bytes padding = **8 bytes** (saves 33% memory!).

**2. Controlling Alignment with #pragma pack:**
- \`#pragma pack(push, 1)\` disables padding for binary serialization, network packets, or memory-mapped hardware protocols.
- **Trade-off:** Minimal memory footprint, but unaligned reads can cause performance penalties on x86 or hardware traps on ARM.

**3. Bitwise Masking for Hardware Control:**
- Setting bits: \`REG |= (1 << n);\`
- Clearing bits: \`REG &= ~(1 << n);\`
- Toggling bits: \`REG ^= (1 << n);\`
- Testing bits: \`if (REG & (1 << n)) { ... }\``,
    interviewerIntent: "Assesses low-level hardware memory awareness, cache efficiency, bit-level hardware registers, and optimization skills in C.",
    answerBlueprint: "1) Explain CPU word alignment and why padding exists. 2) Provide struct ordering example (12 bytes vs 8 bytes). 3) Explain #pragma pack for networking/hardware. 4) Write out standard bit manipulation idioms.",
    codeSnippet: `// 1. Memory-optimized Struct Ordering
struct OptimizedSensorData {
    uint32_t timestamp;  // 4 bytes (offset 0)
    uint16_t sensor_id;  // 2 bytes (offset 4)
    uint8_t flags;       // 1 byte  (offset 6)
    uint8_t status;      // 1 byte  (offset 7)
}; // Total: Exactly 8 bytes, ZERO wasted padding!

// 2. Bitwise Register Manipulation
#define ENABLE_BIT  (1 << 0)
#define READY_BIT   (1 << 3)

void configureHardware(volatile uint32_t *ctrl_reg) {
    *ctrl_reg |= ENABLE_BIT;          // Turn ON Enable bit without altering others
    *ctrl_reg &= ~READY_BIT;          // Clear Ready bit
    *ctrl_reg ^= (1 << 5);            // Toggle bit 5
}`,
    complexity: "Time: O(1) single-cycle bitwise instructions | Space: Zero overhead struct packing",
    commonMistakes: "Placing small char members between pointers and 64-bit integers causing massive struct bloat; ignoring endianness when parsing packed structs across network boundaries.",
    followUpQuestions: [
      "What is the difference between Big-Endian and Little-Endian byte order, and how can you determine endianness at runtime in C?",
      "What is a bitfield in C, and why are bitfields not portable across different compilers for network packet headers?"
    ],
    tags: ["C", "Memory Alignment", "Struct Padding", "Bitwise", "Hardware", "Low-Level"]
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
