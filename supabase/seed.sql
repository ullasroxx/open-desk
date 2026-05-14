-- ═══════════════════════════════════════════════════════════════
-- OpenDesk — Seed Data
-- Run this AFTER schema.sql to populate demo data
-- ═══════════════════════════════════════════════════════════════

-- 1. Institution
INSERT INTO institutions (id, name, code, type, health_score)
VALUES ('11111111-1111-1111-1111-111111111111', 'VTU Autonomous Engineering College', 'VTUAEC', 'autonomous', 88);

-- 2. Departments
INSERT INTO departments (id, institution_id, name, code, health_score) VALUES
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111111', 'Computer Science & Engineering', 'CSE', 92),
  ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111111', 'Information Science & Engineering', 'ISE', 88),
  ('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111111', 'Electronics & Communication', 'ECE', 75),
  ('22222222-2222-2222-2222-222222222204', '11111111-1111-1111-1111-111111111111', 'AI & Machine Learning', 'AIML', 95);

-- 3. Subjects
INSERT INTO subjects (id, department_id, name, code, semester) VALUES
  ('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', 'Data Structures', 'CS302', 3),
  ('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222201', 'Operating Systems', 'CS401', 4),
  ('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222201', 'Computer Networks', 'CS501', 5),
  ('33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222204', 'Machine Learning', 'AI301', 3);

-- 4. Labs
INSERT INTO labs (id, subject_id, created_by, title, description, lab_number, status, ai_rule_mode, max_ai_hints) VALUES
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333301', NULL, 'Binary Search Tree Operations', 'Implement BST insertion, deletion, and traversal', 1, 'active', 'adaptive', 10),
  ('44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333301', NULL, 'Graph Traversal (BFS & DFS)', 'Implement BFS and DFS on adjacency list', 2, 'active', 'adaptive', 10),
  ('44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333301', NULL, 'Dynamic Programming - Knapsack', 'Solve 0/1 Knapsack using DP', 3, 'active', 'strict', 5),
  ('44444444-4444-4444-4444-444444444404', '33333333-3333-3333-3333-333333333302', NULL, 'CPU Scheduling Algorithms', 'Simulate FCFS, SJF, Round Robin', 1, 'draft', 'adaptive', 10);

-- 5. Lab Variants
INSERT INTO lab_variants (lab_id, variant_label, dataset, instructions) VALUES
  ('44444444-4444-4444-4444-444444444401', 'Dataset A', '{"values": [50, 30, 70, 20, 40, 60, 80]}', 'Use Dataset A values for BST construction'),
  ('44444444-4444-4444-4444-444444444401', 'Dataset B', '{"values": [45, 25, 65, 15, 35, 55, 75]}', 'Use Dataset B values for BST construction'),
  ('44444444-4444-4444-4444-444444444401', 'Dataset C', '{"values": [100, 50, 150, 25, 75, 125, 175]}', 'Use Dataset C values for BST construction');

-- 6. Assignments
INSERT INTO assignments (id, subject_id, title, description, difficulty, due_date) VALUES
  ('55555555-5555-5555-5555-555555555501', '33333333-3333-3333-3333-333333333301', 'Implement AVL Tree Rotations', 'Write a program to balance a BST using AVL rotations', 'hard', NOW() + INTERVAL '7 days'),
  ('55555555-5555-5555-5555-555555555502', '33333333-3333-3333-3333-333333333301', 'Hash Table with Chaining', 'Implement a hash table with separate chaining', 'medium', NOW() + INTERVAL '14 days');

-- 7. Viva Question Bank
INSERT INTO viva_question_bank (subject_id, question, topic, difficulty, times_asked, avg_score) VALUES
  ('33333333-3333-3333-3333-333333333301', 'Explain the time complexity of quicksort in best, average, and worst cases', 'Sorting Algorithms', 'medium', 24, 72),
  ('33333333-3333-3333-3333-333333333301', 'What is the difference between BFS and DFS? When would you use each?', 'Graph Algorithms', 'easy', 45, 84),
  ('33333333-3333-3333-3333-333333333301', 'When does a BST degenerate into a linked list? How do you prevent it?', 'Trees', 'hard', 18, 58),
  ('33333333-3333-3333-3333-333333333301', 'Explain the working of dynamic programming with an example', 'Dynamic Programming', 'medium', 32, 65);

-- 8. Badges
INSERT INTO badges (id, name, description, icon, criteria) VALUES
  ('66666666-6666-6666-6666-666666666601', 'First Compile', 'Successfully compiled your first program', '🎯', '{"event": "compile", "count": 1}'),
  ('66666666-6666-6666-6666-666666666602', 'Debug Master', 'Fixed 50+ compilation errors', '🐛', '{"event": "error_fix", "count": 50}'),
  ('66666666-6666-6666-6666-666666666603', 'Flow State', 'Maintained focus > 90% for 30+ minutes', '🧘', '{"focus_score": 90, "duration_min": 30}'),
  ('66666666-6666-6666-6666-666666666604', '7-Day Streak', 'Coded for 7 consecutive days', '🔥', '{"streak_days": 7}'),
  ('66666666-6666-6666-6666-666666666605', 'AI Independent', 'Completed a lab without using AI hints', '🦾', '{"ai_hints": 0, "lab_completed": true}'),
  ('66666666-6666-6666-6666-666666666606', 'Deep Thinker', 'Wrote a reflection scoring > 85% authenticity', '🧠', '{"authenticity_score": 85}');

-- 9. Platform Policies
INSERT INTO platform_policies (institution_id, name, value, category, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Max AI Hints per Lab', '10', 'integrity', true),
  ('11111111-1111-1111-1111-111111111111', 'Code Similarity Threshold', '75%', 'integrity', true),
  ('11111111-1111-1111-1111-111111111111', 'Auto-Viva on AI Dependency', '> 80%', 'automation', true),
  ('11111111-1111-1111-1111-111111111111', 'Paste Detection', 'Enabled', 'integrity', true),
  ('11111111-1111-1111-1111-111111111111', 'Tab-Switch Monitoring', 'Enabled', 'intelligence', true);

-- 10. Prelab Tasks
INSERT INTO prelab_tasks (lab_id, task_type, question, answer, difficulty, sort_order) VALUES
  ('44444444-4444-4444-4444-444444444401', 'concept_check', 'What is the time complexity of BST search in the average case?', '{"correct": "O(log n)", "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"]}', 1, 1),
  ('44444444-4444-4444-4444-444444444401', 'output_predict', 'Given a BST with root 50 and left child 30, what happens when you insert 40?', '{"correct": "40 becomes the right child of 30"}', 2, 2),
  ('44444444-4444-4444-4444-444444444401', 'fill_blank', 'In BST, the left subtree contains nodes with values ____ than the root', '{"correct": "less"}', 1, 3);
