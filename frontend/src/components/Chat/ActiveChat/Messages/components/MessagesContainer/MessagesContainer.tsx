import { FC, ReactNode } from 'react';
import { Box } from '@chakra-ui/react';

interface MessagesContainerProps {
  children?: ReactNode;
}

const MessagesContainer: FC<MessagesContainerProps> = ({ children }) => {
  return (
    <Box
      h="100%"
      id="container"
      overflow="auto"
      px="15px"
      sx={{
        '&::-webkit-scrollbar': {
          width: '15px',
          borderRadius: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
          borderRadius: '8px',
        },
      }}
    >
      {children}
    </Box>
  );
};

export default MessagesContainer;
