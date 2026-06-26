const fs = require('fs');
const path = require('path');

const javaPrograms = [
  { id: 'j1', title: 'Classes & Objects', code: 'class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello Java!");\n  }\n}' },
  { id: 'j2', title: 'Method Overloading', code: 'class Main {\n  static int add(int a, int b) { return a + b; }\n  static double add(double a, double b) { return a + b; }\n  public static void main(String[] args) { System.out.println(add(5, 10)); }\n}' },
  { id: 'j3', title: 'Inheritance & Polymorphism', code: 'class Animal { void sound() { System.out.println("Roar"); } }\nclass Dog extends Animal { void sound() { System.out.println("Bark"); } }\nclass Main { public static void main(String[] args) { Animal myDog = new Dog(); myDog.sound(); } }' },
  { id: 'j4', title: 'Interfaces', code: 'interface Animal { void sound(); }\nclass Dog implements Animal { public void sound() { System.out.println("Bark"); } }\nclass Main { public static void main(String[] args) { new Dog().sound(); } }' },
  { id: 'j5', title: 'Exception Handling', code: 'class Main {\n  public static void main(String[] args) {\n    try { int d = 10 / 0; }\n    catch (ArithmeticException e) { System.out.println("Division by zero."); }\n  }\n}' },
  { id: 'j6', title: 'Multithreading (Runnable)', code: 'class MyThread implements Runnable {\n  public void run() { System.out.println("Thread running"); }\n}\nclass Main { public static void main(String[] args) { new Thread(new MyThread()).start(); } }' },
  { id: 'j7', title: 'Packages', code: 'package mypack;\npublic class Main {\n  public static void main(String[] args) { System.out.println("Package"); }\n}' },
  { id: 'j8', title: 'File Handling (Read/Write)', code: 'import java.io.*;\nclass Main {\n  public static void main(String[] args) throws IOException {\n    FileWriter w = new FileWriter("file.txt"); w.write("Hello"); w.close();\n  }\n}' },
  { id: 'j9', title: 'Applets (Deprecated)', code: 'import java.applet.Applet;\nimport java.awt.Graphics;\npublic class Main extends Applet {\n  public void paint(Graphics g) { g.drawString("Hello Applet", 20, 20); }\n}' },
  { id: 'j10', title: 'Event Handling', code: 'import java.awt.*;\nimport java.awt.event.*;\nclass Main extends Frame implements ActionListener {\n  Button b; Main() { b = new Button("Click"); add(b); b.addActionListener(this); }\n  public void actionPerformed(ActionEvent e) { System.out.println("Clicked"); }\n}' },
  { id: 'j11', title: 'Generics', code: 'class Box<T> {\n  T obj;\n  void add(T obj) { this.obj = obj; }\n  T get() { return obj; }\n}\nclass Main { public static void main(String[] args) { Box<Integer> b = new Box<>(); b.add(10); } }' },
  { id: 'j12', title: 'Collections (ArrayList)', code: 'import java.util.ArrayList;\nclass Main {\n  public static void main(String[] args) {\n    ArrayList<String> list = new ArrayList<>(); list.add("Apple"); System.out.println(list);\n  }\n}' },
  { id: 'j13', title: 'Lambda Expressions', code: 'interface MathOp { int operation(int a, int b); }\nclass Main {\n  public static void main(String[] args) {\n    MathOp add = (a, b) -> a + b; System.out.println(add.operation(10, 5));\n  }\n}' },
  { id: 'j14', title: 'Stream API', code: 'import java.util.*;\nimport java.util.stream.*;\nclass Main {\n  public static void main(String[] args) {\n    List<Integer> list = Arrays.asList(1, 2, 3); list.stream().map(x -> x*x).forEach(System.out::println);\n  }\n}' },
  { id: 'j15', title: 'JDBC Connection', code: 'import java.sql.*;\nclass Main {\n  public static void main(String[] args) {\n    try { Connection c = DriverManager.getConnection("jdbc:mysql://localhost/db", "user", "pass"); } catch(Exception e) {}\n  }\n}' }
];

const cPrograms = [
  { id: 'c1', title: 'Quadratic Equation Roots', code: '#include <stdio.h>\n#include <math.h>\nint main() {\n  double a, b, c, disc, r1, r2;\n  printf("Enter a, b, c: ");\n  scanf("%lf %lf %lf", &a, &b, &c);\n  disc = b*b - 4*a*c;\n  if(disc > 0) {\n    r1 = (-b + sqrt(disc)) / (2*a);\n    r2 = (-b - sqrt(disc)) / (2*a);\n    printf("Roots are real: %.2lf, %.2lf", r1, r2);\n  } else {\n    printf("Roots are complex.");\n  }\n  return 0;\n}' },
  { id: 'c2', title: 'Palindrome Number', code: '#include <stdio.h>\nint main() {\n  int n, rev = 0, rem, orig;\n  printf("Enter integer: ");\n  scanf("%d", &n);\n  orig = n;\n  while(n != 0) { rem = n % 10; rev = rev * 10 + rem; n /= 10; }\n  if(orig == rev) printf("%d is palindrome.", orig);\n  else printf("%d is not palindrome.", orig);\n  return 0;\n}' },
  { id: 'c3', title: 'Simple Calculator', code: '#include <stdio.h>\nint main() {\n  char op;\n  double first, second;\n  printf("Enter operator (+, -, *, /): ");\n  scanf("%c", &op);\n  printf("Enter two operands: ");\n  scanf("%lf %lf", &first, &second);\n  switch(op) {\n    case \'+\': printf("%.1lf + %.1lf = %.1lf", first, second, first+second); break;\n    case \'-\': printf("%.1lf - %.1lf = %.1lf", first, second, first-second); break;\n    case \'*\': printf("%.1lf * %.1lf = %.1lf", first, second, first*second); break;\n    case \'/\': printf("%.1lf / %.1lf = %.1lf", first, second, first/second); break;\n    default: printf("Error! operator is not correct");\n  }\n  return 0;\n}' },
  { id: 'c4', title: 'Matrix Multiplication', code: '#include <stdio.h>\nint main() {\n  int a[10][10], b[10][10], mul[10][10], r, c, i, j, k;\n  printf("Enter rows and columns: ");\n  scanf("%d %d", &r, &c);\n  printf("Enter first matrix elements:\\n");\n  for(i=0;i<r;i++) for(j=0;j<c;j++) scanf("%d", &a[i][j]);\n  printf("Enter second matrix elements:\\n");\n  for(i=0;i<r;i++) for(j=0;j<c;j++) scanf("%d", &b[i][j]);\n  printf("Multiplication:\\n");\n  for(i=0;i<r;i++) { for(j=0;j<c;j++) { mul[i][j]=0; for(k=0;k<c;k++) mul[i][j] += a[i][k]*b[k][j]; printf("%d\\t", mul[i][j]); } printf("\\n"); }\n  return 0;\n}' },
  { id: 'c5', title: 'Binary Search', code: '#include <stdio.h>\nint main() {\n  int arr[10], n, i, key, low, high, mid;\n  printf("Enter number of elements: "); scanf("%d", &n);\n  printf("Enter sorted elements: "); for(i=0; i<n; i++) scanf("%d", &arr[i]);\n  printf("Enter key to search: "); scanf("%d", &key);\n  low = 0; high = n - 1;\n  while(low <= high) {\n    mid = (low + high) / 2;\n    if(arr[mid] == key) { printf("Found at %d", mid); return 0; }\n    else if(arr[mid] < key) low = mid + 1;\n    else high = mid - 1;\n  }\n  printf("Not found.");\n  return 0;\n}' },
  { id: 'c6', title: 'Bubble Sort', code: '#include <stdio.h>\nint main() {\n  int arr[10], n, i, j, temp;\n  printf("Enter n: "); scanf("%d", &n);\n  printf("Enter elements: "); for(i=0; i<n; i++) scanf("%d", &arr[i]);\n  for(i=0; i<n-1; i++) {\n    for(j=0; j<n-i-1; j++) {\n      if(arr[j] > arr[j+1]) {\n        temp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = temp;\n      }\n    }\n  }\n  printf("Sorted array: "); for(i=0; i<n; i++) printf("%d ", arr[i]);\n  return 0;\n}' },
  { id: 'c7', title: 'String Length without library', code: '#include <stdio.h>\nint main() {\n  char s[100]; int i;\n  printf("Enter string: "); scanf("%s", s);\n  for(i = 0; s[i] != \'\\0\'; ++i);\n  printf("Length = %d", i);\n  return 0;\n}' },
  { id: 'c8', title: 'Student Structure', code: '#include <stdio.h>\nstruct student { char name[50]; int roll; float marks; } s;\nint main() {\n  printf("Enter name, roll, marks: ");\n  scanf("%s %d %f", s.name, &s.roll, &s.marks);\n  printf("Student: %s, Roll: %d, Marks: %.2f", s.name, s.roll, s.marks);\n  return 0;\n}' },
  { id: 'c9', title: 'Pointers to Arrays', code: '#include <stdio.h>\nint main() {\n  int data[5], i;\n  printf("Enter elements: ");\n  for(i = 0; i < 5; ++i) scanf("%d", data + i);\n  printf("You entered: ");\n  for(i = 0; i < 5; ++i) printf("%d\\n", *(data + i));\n  return 0;\n}' },
  { id: 'c10', title: 'Recursive Factorial', code: '#include <stdio.h>\nlong int multiplyNumbers(int n);\nint main() {\n  int n;\n  printf("Enter a positive integer: ");\n  scanf("%d",&n);\n  printf("Factorial of %d = %ld", n, multiplyNumbers(n));\n  return 0;\n}\nlong int multiplyNumbers(int n) {\n  if (n>=1) return n*multiplyNumbers(n-1);\n  else return 1;\n}' },
  { id: 'c11', title: 'Fibonacci Series', code: '#include <stdio.h>\nint main() {\n  int i, n, t1 = 0, t2 = 1, nextTerm;\n  printf("Enter number of terms: ");\n  scanf("%d", &n);\n  printf("Fibonacci Series: ");\n  for (i = 1; i <= n; ++i) {\n    printf("%d, ", t1);\n    nextTerm = t1 + t2;\n    t1 = t2;\n    t2 = nextTerm;\n  }\n  return 0;\n}' },
  { id: 'c12', title: 'File Write', code: '#include <stdio.h>\nint main() {\n  FILE *fptr;\n  fptr = fopen("program.txt","w");\n  if(fptr == NULL) { printf("Error!"); return 1; }\n  fprintf(fptr,"%s","Hello from File!");\n  fclose(fptr);\n  printf("Written successfully");\n  return 0;\n}' },
  { id: 'c13', title: 'Tower of Hanoi', code: '#include <stdio.h>\nvoid towerOfHanoi(int n, char from_rod, char to_rod, char aux_rod) {\n  if (n == 1) { printf("\\n Move disk 1 from rod %c to rod %c", from_rod, to_rod); return; }\n  towerOfHanoi(n - 1, from_rod, aux_rod, to_rod);\n  printf("\\n Move disk %d from rod %c to rod %c", n, from_rod, to_rod);\n  towerOfHanoi(n - 1, aux_rod, to_rod, from_rod);\n}\nint main() { int n = 4; towerOfHanoi(n, \'A\', \'C\', \'B\'); return 0; }' },
  { id: 'c14', title: 'Taylor Series Sin(x)', code: '#include <stdio.h>\n#include <math.h>\nint main() {\n  int i, n; float x, sum, t;\n  printf("Enter value for x and n: "); scanf("%f %d", &x, &n);\n  x = x * 3.14159 / 180; t = x; sum = x;\n  for(i=1; i<=n; i++) {\n    t = (t * (-1) * x * x) / (2 * i * (2 * i + 1));\n    sum = sum + t;\n  }\n  printf("Sin(x) = %f", sum);\n  return 0;\n}' },
  { id: 'c15', title: 'Prime Numbers', code: '#include <stdio.h>\nint main() {\n  int low, high, i, flag;\n  printf("Enter two numbers(intervals): "); scanf("%d %d", &low, &high);\n  printf("Prime numbers between %d and %d are: ", low, high);\n  while (low < high) {\n    flag = 0;\n    if (low <= 1) { ++low; continue; }\n    for (i = 2; i <= low / 2; ++i) { if (low % i == 0) { flag = 1; break; } }\n    if (flag == 0) printf("%d ", low);\n    ++low;\n  }\n  return 0;\n}' }
];

const cppPrograms = [
  { id: 'cpp1', title: 'Student Class', code: '#include <iostream>\nusing namespace std;\nclass Student {\n  string name; int roll;\npublic:\n  void get() { cout<<"Enter Name and Roll: "; cin>>name>>roll; }\n  void show() { cout<<"Name: "<<name<<", Roll: "<<roll<<endl; }\n};\nint main() {\n  Student s;\n  s.get(); s.show();\n  return 0;\n}' },
  { id: 'cpp2', title: 'Function Overloading', code: '#include <iostream>\nusing namespace std;\nint area(int s) { return s*s; }\ndouble area(double r) { return 3.14*r*r; }\nint main() {\n  cout<<"Square Area: "<<area(5)<<endl;\n  cout<<"Circle Area: "<<area(5.5)<<endl;\n  return 0;\n}' },
  { id: 'cpp3', title: 'Inline Functions', code: '#include <iostream>\nusing namespace std;\ninline int cube(int s) { return s*s*s; }\nint main() {\n  cout << "The cube of 3 is: " << cube(3) << "\\n";\n  return 0;\n}' },
  { id: 'cpp4', title: 'Operator Overloading (+)', code: '#include<iostream>\nusing namespace std;\nclass Complex {\nprivate:\n  int real, imag;\npublic:\n  Complex(int r = 0, int i =0)  {real = r;   imag = i;}\n  Complex operator + (Complex const &obj) {\n    Complex res;\n    res.real = real + obj.real;\n    res.imag = imag + obj.imag;\n    return res;\n  }\n  void print() { cout << real << " + i" << imag << endl; }\n};\nint main() {\n  Complex c1(10, 5), c2(2, 4);\n  Complex c3 = c1 + c2;\n  c3.print();\n}' },
  { id: 'cpp5', title: 'Single Inheritance', code: '#include <iostream>\nusing namespace std;\nclass Base {\npublic:\n  int baseVal = 10;\n};\nclass Derived: public Base {\npublic:\n  int derivedVal = 20;\n};\nint main() {\n  Derived d;\n  cout<<"Base: "<<d.baseVal<<", Derived: "<<d.derivedVal;\n  return 0;\n}' },
  { id: 'cpp6', title: 'Multiple Inheritance', code: '#include <iostream>\nusing namespace std;\nclass A { public: void showA() { cout<<"Class A"<<endl; } };\nclass B { public: void showB() { cout<<"Class B"<<endl; } };\nclass C: public A, public B {};\nint main() { C obj; obj.showA(); obj.showB(); return 0; }' },
  { id: 'cpp7', title: 'Virtual Functions', code: '#include<iostream>\nusing namespace std;\nclass Base {\npublic:\n  virtual void print() { cout<<"print base class\\n"; }\n  void show() { cout<<"show base class\\n"; }\n};\nclass Derived:public Base {\npublic:\n  void print() { cout<<"print derived class\\n"; }\n  void show() { cout<<"show derived class\\n"; }\n};\nint main() {\n  Base *bptr; Derived d;\n  bptr = &d;\n  bptr->print(); // Virtual, calls derived\n  bptr->show(); // Non-virtual, calls base\n  return 0;\n}' },
  { id: 'cpp8', title: 'Friend Function', code: '#include <iostream>\nusing namespace std;\nclass Box {\n  double width;\npublic:\n  friend void printWidth( Box box );\n  void setWidth( double wid );\n};\nvoid Box::setWidth( double wid ) { width = wid; }\nvoid printWidth( Box box ) { cout << "Width of box : " << box.width <<endl; }\nint main() { Box box; box.setWidth(10.0); printWidth( box ); return 0; }' },
  { id: 'cpp9', title: 'Templates', code: '#include <iostream>\nusing namespace std;\ntemplate <typename T>\nT myMax(T x, T y) {\n  return (x > y)? x: y;\n}\nint main() {\n  cout << myMax<int>(3, 7) << endl;\n  cout << myMax<char>(\'g\', \'e\') << endl;\n  return 0;\n}' },
  { id: 'cpp10', title: 'Exception Handling', code: '#include <iostream>\nusing namespace std;\nint main() {\n  int x = -1;\n  try {\n    cout<<"Inside try \\n";\n    if (x < 0) throw x;\n  }\n  catch (int x ) { cout<<"Exception Caught \\n"; }\n  return 0;\n}' },
  { id: 'cpp11', title: 'Constructors/Destructors', code: '#include <iostream>\nusing namespace std;\nclass Line {\npublic:\n  Line() { cout << "Object created" << endl; }\n  ~Line() { cout << "Object deleted" << endl; }\n};\nint main() { Line line; return 0; }' },
  { id: 'cpp12', title: 'File I/O', code: '#include <iostream>\n#include <fstream>\nusing namespace std;\nint main() {\n  ofstream file("test.txt");\n  file << "Hello File I/O C++";\n  file.close();\n  return 0;\n}' },
  { id: 'cpp13', title: 'STL Vector', code: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n  vector<int> v = {1, 2, 3};\n  v.push_back(4);\n  for(int x : v) cout << x << " ";\n  return 0;\n}' },
  { id: 'cpp14', title: 'Pure Virtual Functions (Abstract Class)', code: '#include<iostream>\nusing namespace std;\nclass Base {\npublic:\n  virtual void show() = 0;\n};\nclass Derived: public Base {\npublic:\n  void show() { cout << "Implementation of Virtual Function"; }\n};\nint main() {\n  Base *b = new Derived();\n  b->show();\n  return 0;\n}' },
  { id: 'cpp15', title: 'STL List', code: '#include <iostream>\n#include <list>\nusing namespace std;\nint main() {\n  list<int> l = {10, 20, 30};\n  l.push_front(5);\n  for(int x : l) cout << x << " ";\n  return 0;\n}' }
];

const pythonPrograms = [
  { id: 'p1', title: 'Student Grade', code: 'marks = int(input("Enter marks: "))\nif marks > 90:\n    print("Grade A")\nelif marks > 75:\n    print("Grade B")\nelse:\n    print("Grade C")' },
  { id: 'p2', title: 'Fibonacci Sequence', code: 'def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        print(a, end=" ")\n        a, b = b, a+b\nfib(10)' },
  { id: 'p3', title: 'Dictionary Word Count', code: 'text = "hello world hello python"\nwords = text.split()\ncounts = {}\nfor w in words:\n    counts[w] = counts.get(w, 0) + 1\nprint(counts)' },
  { id: 'p4', title: 'List Comprehensions', code: 'squares = [x**2 for x in range(10) if x % 2 == 0]\nprint("Even squares:", squares)' },
  { id: 'p5', title: 'Regex Email Validate', code: 'import re\nregex = r"^[a-z0-9]+[\\._]?[a-z0-9]+[@]\\w+[.]\\w{2,3}$"\ndef check(email):\n    if re.search(regex, email): print("Valid")\n    else: print("Invalid")\ncheck("test@example.com")' },
  { id: 'p6', title: 'File Read/Write', code: 'with open("test.txt", "w") as f:\n    f.write("Hello Python File!")\nwith open("test.txt", "r") as f:\n    print(f.read())' },
  { id: 'p7', title: 'Classes & Objects', code: 'class Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        print(f"{self.name} says Woof!")\nd = Dog("Rex")\nd.bark()' },
  { id: 'p8', title: 'Inheritance', code: 'class Animal:\n    def speak(self):\n        print("Animal Speaking")\nclass Dog(Animal):\n    def speak(self):\n        print("Barking")\nd = Dog()\nd.speak()' },
  { id: 'p9', title: 'Exception Handling', code: 'try:\n    x = 10 / 0\nexcept ZeroDivisionError:\n    print("Cannot divide by zero")\nfinally:\n    print("Execution complete")' },
  { id: 'p10', title: 'Bubble Sort', code: 'def bubbleSort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\narr = [64, 34, 25, 12, 22, 11, 90]\nbubbleSort(arr)\nprint("Sorted:", arr)' },
  { id: 'p11', title: 'Binary Search', code: 'def binary_search(arr, x):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] < x: low = mid + 1\n        elif arr[mid] > x: high = mid - 1\n        else: return mid\n    return -1\nprint("Found at:", binary_search([2, 3, 4, 10, 40], 10))' },
  { id: 'p12', title: 'Decorators', code: 'def my_decorator(func):\n    def wrapper():\n        print("Before function")\n        func()\n        print("After function")\n    return wrapper\n@my_decorator\ndef say_hello():\n    print("Hello!")\nsay_hello()' },
  { id: 'p13', title: 'Generators', code: 'def my_gen():\n    yield 1\n    yield 2\n    yield 3\nfor val in my_gen():\n    print(val)' },
  { id: 'p14', title: 'Map, Filter, Reduce', code: 'from functools import reduce\nnums = [1, 2, 3, 4, 5]\nsquared = list(map(lambda x: x**2, nums))\nevens = list(filter(lambda x: x%2==0, nums))\nsum_all = reduce(lambda x,y: x+y, nums)\nprint(squared, evens, sum_all)' },
  { id: 'p15', title: 'Lambda Functions', code: 'add = lambda x, y: x + y\nprint(add(5, 3))' }
];

const allPrograms = [
  ...javaPrograms.map((p, i) => ({ ...p, lang: 'java', description: 'Standard VTU Lab Program for ' + p.title, videoId: 'dQw4w9WgXcQ' })),
  ...cPrograms.map((p, i) => ({ ...p, lang: 'c', description: 'Standard C Lab Program: ' + p.title, videoId: 'e8xUvTzRj_Q' })),
  ...cppPrograms.map((p, i) => ({ ...p, lang: 'cpp', description: 'Standard C++ OOP Program: ' + p.title, videoId: '8jLOx1hD3_o' })),
  ...pythonPrograms.map((p, i) => ({ ...p, lang: 'python', description: 'Standard Python Lab Program: ' + p.title, videoId: 'rfscVS0vtbw' })),
];

const fileContent = `export interface LabProgram {
  id: string;
  lang: string;
  title: string;
  description: string;
  code: string;
  videoId: string;
}

export const labPrograms: LabProgram[] = ${JSON.stringify(allPrograms, null, 2)};
`;

const dir = path.join(__dirname, 'src', 'lib', 'data');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}
fs.writeFileSync(path.join(dir, 'lab-programs.ts'), fileContent);
console.log('Successfully generated full real lab-programs.ts');
