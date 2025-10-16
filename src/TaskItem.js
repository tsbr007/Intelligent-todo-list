import { Reorder, useDragControls } from 'framer-motion';
import styled from 'styled-components';
import { CATEGORY_COLORS } from './categories'; // Import category colors

// --- Styled Components (Updated) ---
const ListItem = styled(Reorder.Item)`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  margin-bottom: 12px;
  background: ${props => props.$isComplete ? '#e0f7fa' : '#ffffff'};
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: background 0.3s, box-shadow 0.3s;
  /* Use category color for the left border, or teal for completed tasks */
  border-left: 6px solid ${props => props.$isComplete ? '#00897b' : CATEGORY_COLORS[props.$category] || '#1a73e8'};
  
  &:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: flex-start; /* Align items to the start (left) */
  flex-direction: column;
  margin-left: 15px;
`;

const Checkbox = styled.input`
  min-width: 20px;
  min-height: 20px;
  cursor: pointer;
  accent-color: ${props => props.$isComplete ? '#00897b' : '#1a73e8'};
`;

const TaskText = styled.span`
  font-size: 1.1em;
  color: ${props => props.$isComplete ? '#666' : '#333'};
  text-decoration: ${props => props.$isComplete ? 'line-through' : 'none'};
  transition: color 0.3s, text-decoration 0.3s;
  font-weight: 500;
`;

const DetailsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%; /* Ensure the row takes full width */
  margin-top: 5px;
  font-size: 0.85em;
  color: #999;
`;

const CategoryTag = styled.span`
  padding: 2px 8px;
  border-radius: 5px;
  color: white;
  background-color: ${props => props.$color};
  font-weight: 600;
  opacity: ${props => props.$isComplete ? 0.7 : 1};
`;

const DurationLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 5px; /* Space between icon and text */
  font-weight: 600;
  color: ${props => props.$isComplete ? '#999' : '#333'};
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.4em;
  line-height: 1;
  padding: 5px;
  margin-left: 8px;
  border-radius: 50%;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: #f0f0f0;
  }
`;

const EditButton = styled(ActionButton)`
  color: #1a73e8;
  font-size: 1.2em;
`;

const DeleteButton = styled(ActionButton)`
  color: #e53935;
  &:hover {
    background: #ffebee;
    color: #c62828;
  }
`;

const DragHandle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  color: #b0b0b0;
  margin-right: 15px;
  &:hover {
    color: #333;
  }
`;


// --- Framer Motion Variants (Remaining the same) ---
const itemVariants = {
  initial: { opacity: 0, height: 0, y: -20 },
  animate: { opacity: 1, height: 'auto', y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
  exit: { 
    opacity: 0, 
    height: 0, 
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: 0, 
    transition: { duration: 0.3, ease: 'easeOut' } 
  },
};

const TaskItem = ({ task, isReorderable, onToggle, onDelete, onEdit }) => {
  const categoryColor = CATEGORY_COLORS[task.category] || '#333';
  const dragControls = useDragControls();

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete this task?\n\n"${task.text}"`)) {
      onDelete(task.id, task.isComplete);
    }
  };

  return (
    <ListItem
      $isComplete={task.isComplete}
      $category={task.category}
      // Reorder.Item props
      value={task}
      dragListener={false} // Disable dragging on the whole item
      dragControls={dragControls}
      as="li"
      // Animation props
      variants={itemVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
    >
      {isReorderable && (
        <DragHandle onPointerDown={(e) => dragControls.start(e)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
        </DragHandle>
      )}
      <Checkbox
        type="checkbox"
        checked={task.isComplete}
        $isComplete={task.isComplete}
        onChange={(e) => { 
            e.stopPropagation();
            onToggle(task.id, task.isComplete);
        }}
        onClick={(e) => e.stopPropagation()} // Stop propagation on click to avoid double-firing
      />
      
      <ContentWrapper>
        <TaskText $isComplete={task.isComplete}>
          {task.text}
        </TaskText>
        <DetailsRow>
          <CategoryTag $color={categoryColor} $isComplete={task.isComplete}>
            {task.category}
          </CategoryTag>
          <DurationLabel $isComplete={task.isComplete}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>
              {task.duration} min
            </span>
          </DurationLabel>
        </DetailsRow>
      </ContentWrapper>
      {!task.isComplete && (
        <EditButton onClick={() => onEdit(task)} aria-label="Edit task">
          ✏️
        </EditButton>
      )}
      <DeleteButton onClick={handleDelete} aria-label="Delete task">
        &times;
      </DeleteButton>
    </ListItem>
  );
};

export default TaskItem;