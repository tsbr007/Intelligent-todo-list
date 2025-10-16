import { AnimatePresence, Reorder } from 'framer-motion';
import styled from 'styled-components';
import TaskItem from './TaskItem';

// --- Styled Components ---
const List = styled(Reorder.Group)`
  list-style: none;
  padding: 0;
  margin: 20px 0 0;
`;

const TaskList = ({ tasks, setTasks, onToggle, onDelete, onEdit }) => {
  const isReorderable = !!setTasks;

  return (
    <List as={isReorderable ? Reorder.Group : 'ul'} values={tasks} onReorder={setTasks}>
      <AnimatePresence initial={false}>
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            isReorderable={isReorderable}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </AnimatePresence>
    </List>
  );
};

export default TaskList;