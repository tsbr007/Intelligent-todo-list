import styled from 'styled-components';

// --- Styled Components ---
const HeaderContainer = styled.header`
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
`;

const Title = styled.h1`
  font-size: 2.5em;
  color: #333;
  margin: 0;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: 1.1em;
  color: #666;
  margin-top: 5px;
`;

export const Header = ({ title, date }) => {
  return (
    <HeaderContainer>
      <Title>{title}</Title>
      <Subtitle>{date}</Subtitle>
    </HeaderContainer>
  );
};