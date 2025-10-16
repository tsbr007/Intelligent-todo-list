import { useState } from 'react';
import styled, { css } from 'styled-components';
import { CATEGORY_NAMES } from './categories'; // Import category names

// --- Styled Components (Updated/Extended) ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 1000px; /* Make the modal even wider */
  position: relative;
`;

const ModalTitle = styled.h3`
  margin: 0 0 25px;
  font-size: 1.6em;
  font-weight: 600;
  color: #333;
`;

const InputContainer = styled.div`
  position: relative;
`;

const FormRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const InputGroup = styled.div`
  flex: ${props => props.$flex || '1'};
  position: relative;
`;

const inputStyles = css`
  width: 100%;
  padding: 15px 20px;
  font-size: 1.1em;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
  
  &:focus {
    border-color: #1a73e8;
    box-shadow: 0 0 8px rgba(26, 115, 232, 0.2);
  }
`;

const InputField = styled.input`
  ${inputStyles}
`;

const Dropdown = styled.select`
  ${inputStyles}
  appearance: none; /* Remove default arrow in some browsers */
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 1.2em;
  padding-right: 45px; /* Add more padding to prevent text overlapping the arrow */
  cursor: pointer;
`;

const DurationInput = styled(InputField)`
  text-align: right;
  padding-right: 45px; /* Adjust padding to make room for "min" label */
`;

const DurationLabel = styled.span`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  pointer-events: none; /* Allow clicks to pass through to the input */
  font-size: 1em;
`;

const AddButton = styled.button`
  background: #1a73e8;
  color: white;
  border: none;
  padding: 0 20px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: 600;
  transition: background 0.3s;

  &:hover {
    background: #145cb3;
  }
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-top: none;
  border-radius: 0 0 10px 10px;
  z-index: 10;
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
`;

const SuggestionItem = styled.li`
  padding: 10px 20px;
  font-size: 0.95em;
  color: #555;
  cursor: pointer;
  &:hover {
    background: #f0f8ff;
    color: #1a73e8;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 1.8em;
  line-height: 1;
  color: #999;
  cursor: pointer;
  transition: color 0.2s;
  &:hover {
    color: #333;
  }
`;

const TaskInput = ({ addTask, suggestions, onClose, initialTask, onEdit }) => {
  const [text, setText] = useState(initialTask?.text || '');
  const [category, setCategory] = useState(initialTask?.category || CATEGORY_NAMES[0]);
  const [duration, setDuration] = useState(initialTask?.duration || 30);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(text.toLowerCase()) && text.length > 0
  ).slice(0, 5);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      if (initialTask) {
        onEdit(initialTask.id, text, category, duration);
      } else {
        addTask(text, category, duration);
      }
      setText(''); // Clear fields for next use
      onClose();
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setText(suggestion);
    setShowSuggestions(false);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>{initialTask ? 'Edit Task' : 'Add a New Task'}</ModalTitle>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <InputContainer>
          <form onSubmit={handleSubmit}>
            <FormRow>
              <InputGroup $flex="5">
                <InputField
                  type="text"
                  placeholder="Task description (e.g., 'Draft Medium Blog')"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  autoFocus
                />
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <SuggestionsList>
                    {filteredSuggestions.map((suggestion, index) => (
                      <SuggestionItem 
                        key={index} 
                        onMouseDown={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </SuggestionItem>
                    ))}
                  </SuggestionsList>
                )}
              </InputGroup>
              
              <InputGroup $flex="2">
                <Dropdown value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORY_NAMES.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </Dropdown>
              </InputGroup>

              <InputGroup $flex="1">
                <DurationInput
                  type="number"
                  min="5"
                  step="5"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
                <DurationLabel>min</DurationLabel>
              </InputGroup>

              <AddButton type="submit">{initialTask ? 'Save' : 'Add'}</AddButton>
            </FormRow>
          </form>
        </InputContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TaskInput;