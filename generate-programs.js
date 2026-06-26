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
  { id: 'j15', title: 'JDBC Connection', code: 'import java.sql.*;\nclass Main {\n  public static void main(String[] args) {\n    try { Connection c = DriverManager.getConnection("jdbc:mysql://localhost/db", "user", "pass"); } catch(Exception e) {}\n  }\n}' },
];

const cPrograms = Array.from({length: 15}, (_, i) => ({
  id: `c${i+1}`, title: `C Program ${i+1}`, code: '#include <stdio.h>\nint main() {\n  printf("Hello C program ' + (i+1) + '");\n  return 0;\n}'
}));

const cppPrograms = Array.from({length: 15}, (_, i) => ({
  id: `cpp${i+1}`, title: `C++ OOP Concept ${i+1}`, code: '#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello C++ program ' + (i+1) + '";\n  return 0;\n}'
}));

const pythonPrograms = Array.from({length: 15}, (_, i) => ({
  id: `py${i+1}`, title: `Python Lab ${i+1}`, code: 'print("Hello Python program ' + (i+1) + '")'
}));

const allPrograms = [
  ...javaPrograms.map(p => ({ ...p, lang: 'java', description: 'Standard VTU Lab Program for ' + p.title, videoId: 'dQw4w9WgXcQ' })), // Never gonna give you up
  ...cPrograms.map(p => ({ ...p, lang: 'c', description: 'Standard C Lab Program', videoId: 'e8xUvTzRj_Q' })),
  ...cppPrograms.map(p => ({ ...p, lang: 'cpp', description: 'Standard C++ OOP Program', videoId: '8jLOx1hD3_o' })),
  ...pythonPrograms.map(p => ({ ...p, lang: 'python', description: 'Standard Python Lab Program', videoId: 'rfscVS0vtbw' })),
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

fs.writeFileSync(path.join(__dirname, 'src', 'lib', 'data', 'lab-programs.ts'), fileContent);
console.log('Successfully generated lab-programs.ts');
