import { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Header } from './Header'; // Use a named import
import TaskInput from './TaskInput';
import TaskList from './TaskList';
import { CATEGORY_NAMES } from './categories';

// --- Hidden Suggestion List (Remaining the same) ---
const SUGGESTIONS = [
  "Review Kafka Consumer Lag Metrics",
  "Implement Transactional Outbox Pattern (Spring Boot)",
  "Write Terraform for EKS Cluster (Practice)",
  "Refine RAG Pipeline Logic using DSPy",
  "Research Vector DB Indexing Strategies",
  "Complete Airflow DAG for ETL Job",
  "Study AWS Certified Data Analytics Specialty (Topic 3)",
  "Prepare for Distinguished Engineer Interview",
  "Set up Databricks Environment for hands-on",
  "Draft Blog: Agentic AI & POML adoption",
];

// --- Global Styles (Remaining the same) ---
const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #f0f2f5;
    color: #333;
    padding: 0;
    margin: 0;
  }
`;

// --- Styled Components (Remaining the same) ---
const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: #1a73e8; 
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 8px;
  margin-top: 30px;
  font-weight: 600;
`;

const CompletedSectionTitle = styled(SectionTitle)`
  color: #00897b;
`;

const AddTaskButton = styled.button`
  display: block;
  width: 100%;
  padding: 15px;
  font-size: 1.2em;
  font-weight: 600;
  color: white;
  background: #1a73e8;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  margin-bottom: 20px;

  &:hover {
    background: #145cb3;
  }
`;

// --- Sorting Logic ---
const categoryOrder = CATEGORY_NAMES.reduce((acc, name, index) => {
  acc[name] = index;
  return acc;
}, {});

const sortTasks = (tasks) => {
  return [...tasks].sort((a, b) => categoryOrder[a.category] - categoryOrder[b.category]);
};

function App() {
  // Load initial state from localStorage, or use default values
  const [activeTasks, setActiveTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('todo-activeTasks');
      return saved ? JSON.parse(saved) : [
        { id: 1, text: "Master Kafka Streams for microservices", isComplete: false, category: 'Career / Learning', duration: 90 },
        { id: 2, text: "COBOL-to-English Logic Converter Review", isComplete: false, category: 'Office Work (Wells Fargo)', duration: 60 },
        { id: 3, text: "Vocabulary session with Ojas", isComplete: false, category: 'Household / Family', duration: 30 },
      ];
    } catch (error) {
      console.error("Failed to parse active tasks from localStorage", error);
      return []; // Return empty array on error
    }
  });

  const [completedTasks, setCompletedTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('todo-completedTasks');
      return saved ? JSON.parse(saved) : [
        { id: 4, text: "Update resume with GenAI tooling skills", isComplete: true, category: 'Career / Learning', duration: 120 },
      ];
    } catch (error) {
      console.error("Failed to parse completed tasks from localStorage", error);
      return []; // Return empty array on error
    }
  });

  // Save state to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('todo-activeTasks', JSON.stringify(activeTasks));
    localStorage.setItem('todo-completedTasks', JSON.stringify(completedTasks));
  }, [activeTasks, completedTasks]);

  const [isInputVisible, setIsInputVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // null when no task is being edited

  const [listTitle, setListTitle] = useState("Intelligent Task Manager");
  const [listDate, setListDate] = useState(new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  }));

  const getNextId = () => {
    const allIds = [...activeTasks, ...completedTasks].map(t => t.id);
    return allIds.length > 0 ? Math.max(...allIds) + 1 : 1;
  };

  const addTask = (text, category, duration) => {
    const trimmedText = text.trim();
    if (trimmedText === '') return;

    const isDuplicate =
      activeTasks.some(task => task.text.toLowerCase() === trimmedText.toLowerCase()) ||
      completedTasks.some(task => task.text.toLowerCase() === trimmedText.toLowerCase());

    if (isDuplicate) {
      alert(`Task "${trimmedText}" already exists.`);
      return;
    }

    const newTask = {
      id: getNextId(),
      text: trimmedText,
      isComplete: false,
      category,
      duration: parseInt(duration) || 0, // Ensure it's a number
    };
    setActiveTasks(prev => sortTasks([newTask, ...prev]));
  };

  const toggleTask = (taskId, isComplete) => {
    if (isComplete) { // Task is currently complete, move to active
      setCompletedTasks(prevCompleted => prevCompleted.filter(task => task.id !== taskId));
      setActiveTasks(prevActive => {
        const taskToMove = completedTasks.find(task => task.id === taskId);
        return taskToMove ? sortTasks([{ ...taskToMove, isComplete: false }, ...prevActive]) : prevActive;
      });
    } else { // Task is currently active, move to complete
      setActiveTasks(prevActive => sortTasks(prevActive.filter(task => task.id !== taskId)));
      setCompletedTasks(prevCompleted => {
        const taskToMove = activeTasks.find(task => task.id === taskId);
        return taskToMove ? [{ ...taskToMove, isComplete: true }, ...prevCompleted] : prevCompleted;
      });
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const updateTask = (taskId, newText, newCategory, newDuration) => {
    const updater = (tasks) =>
      tasks.map(task =>
        task.id === taskId
          ? { ...task, text: newText, category: newCategory, duration: parseInt(newDuration, 10) || 0 }
          : task
      );
    setActiveTasks(prev => sortTasks(updater(prev)));
    setEditingTask(null); // Close the modal
  };

  const deleteTask = (taskId, isComplete) => {
    if (isComplete) {
      setCompletedTasks(prevCompleted => prevCompleted.filter(task => task.id !== taskId));
    } else {
      setActiveTasks(prevActive => sortTasks(prevActive.filter(task => task.id !== taskId)));
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header 
          title={listTitle} 
          setTitle={setListTitle} 
          date={listDate} 
          setDate={setListDate}
        />
        <AddTaskButton onClick={() => setIsInputVisible(true)}>
          + Add New Task
        </AddTaskButton>

        {isInputVisible && (
          <TaskInput 
            addTask={addTask} 
            suggestions={SUGGESTIONS} 
            onClose={() => setIsInputVisible(false)} 
          />
        )}

        {editingTask && (
          <TaskInput initialTask={editingTask} onEdit={updateTask} suggestions={SUGGESTIONS} onClose={() => setEditingTask(null)} />
        )}

        <SectionTitle>🚀 Active Tasks ({activeTasks.length})</SectionTitle>
        <TaskList tasks={activeTasks} setTasks={setActiveTasks} onToggle={toggleTask} onDelete={deleteTask} onEdit={handleEdit} />

        {completedTasks.length > 0 && (
          <>
            <CompletedSectionTitle>✅ Completed Tasks ({completedTasks.length})</CompletedSectionTitle>
            <TaskList tasks={completedTasks} onToggle={toggleTask} onDelete={deleteTask} onEdit={() => {}} />
          </>
        )}
      </Container>
    </>
  );
}

export default App;