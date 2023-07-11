import { ViewIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Avatar,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}

      <Modal size='lg' isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />

        <ModalContent h='300px'>
          <ModalHeader
            display='flex'
            fontSize='40px'
            justifyContent='center'
            fontFamily='Work sans'
          >
            {user.name}
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody
            display='flex'
            flexDir='column'
            alignItems='center'
            justifyContent='space-between'
          >
            
            <Avatar
              size='xl'
              cursor='pointer'
              name={user.name}
              src={user.pic}
            />

            <Text color='gray.500' fontSize={{ base: "24px", md: "26px" }}>
              Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
