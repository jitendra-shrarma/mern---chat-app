import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  // Form data and event handler
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Update the credentials object when input fields change
  const handleCredentials = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const submitHandler = async () => {
    setLoading(true);

    // If any required field is missing
    if (
      !credentials.name ||
      !credentials.email ||
      !credentials.password ||
      !credentials.confirmPassword
    ) {
      setLoading(false);
      return toast({
        title: "Please fill in all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
        variant: "left-accent",
      });
    }

    // If password and confirm password don't match
    if (credentials.password !== credentials.confirmPassword) {
      setLoading(false);
      return toast({
        title: "Passwords do not match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
        variant: "left-accent",
      });
    }

    // Submit the data
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
        }),
      });
      const data = await response.json();

      toast({
        title: data.message,
        status: !data.success ? "error" : "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
        variant: !data.success ? "left-accent" : "solid",
      });

      if (data.success) {
        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        navigate("/chats");
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      return toast({
        title: "Internal server error",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
        variant: "solid",
      });
    }
  };

  return (
    <Stack spacing='6'>
      <Stack spacing='5'>
        <FormControl isRequired id='name'>
          <FormLabel htmlFor='name'>Name</FormLabel>
          <Input
            type='text'
            name='name'
            value={credentials.name}
            placeholder='Enter Your Name'
            onChange={handleCredentials}
          />
        </FormControl>
      </Stack>

      <Stack spacing='5'>
        <FormControl isRequired id='email'>
          <FormLabel htmlFor='email'>Email</FormLabel>
          <Input
            type='email'
            name='email'
            value={credentials.email}
            placeholder='Enter Your Email'
            onChange={handleCredentials}
          />
        </FormControl>
      </Stack>

      <Stack spacing='5'>
        <FormControl isRequired id='password'>
          <FormLabel htmlFor='password'>Password</FormLabel>
          <InputGroup>
            <InputRightElement w={toggle ? "4.0rem" : "4.3rem"}>
              <Button variant='ghost' h='1.75rem' size='sm' onClick={() => setToggle(!toggle)}>
                {toggle ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
            <Input
              type={toggle ? "text" : "password"}
              name='password'
              value={credentials.password}
              placeholder='Password'
              onChange={handleCredentials}
            />
          </InputGroup>
        </FormControl>
      </Stack>

      <Stack spacing='5'>
        <FormControl isRequired id='confirmPassword'>
          <FormLabel htmlFor='confirmPassword'>Confirm Password</FormLabel>
          <InputGroup>
            <InputRightElement w={toggle ? "4.0rem" : "4.3rem"}>
              <Button variant='ghost' h='1.75rem' size='sm' onClick={() => setToggle(!toggle)}>
                {toggle ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
            <Input
              type={toggle ? "text" : "password"}
              name='confirmPassword'
              value={credentials.confirmPassword}
              placeholder='Confirm Password'
              onChange={handleCredentials}
            />
          </InputGroup>
        </FormControl>
      </Stack>

      <Button
        colorScheme='green'
        width='100%'
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </Stack>
  );
};

export default Signup;
