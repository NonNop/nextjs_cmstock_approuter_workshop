"use client";
import { add, signUp, userSelector } from "@/src/store/slices/userSlice";
import { useAppDispatch } from "@/src/store/store";
import { yupResolver } from "@hookform/resolvers/yup";
import { Email, Password } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as Yup from "yup";

interface User {
  username: string;
  password: string;
}

type Props = {};

export default function Register({}: Props) {
  const router = useRouter();
  const initialValue: User = { username: "", password: "" };
  const formValidateSchema = Yup.object().shape({
    username: Yup.string().required("Username is required").trim(),
    password: Yup.string().required("Password is required").trim(),
  });

  const reducer = useSelector(userSelector);
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    defaultValues: initialValue,
    resolver: yupResolver(formValidateSchema),
  });

  const showForm = () => {
    return (
      <form
        onSubmit={handleSubmit(async (value: User) => {
          const result = await dispatch(signUp(value));
          if (signUp.fulfilled.match(result)) {
            alert("Register successfully");
          } else if (signUp.rejected.match(result)) {
            alert("Register failed");
          }
        })}
      >
        {/* Username */}
        <Controller
          control={control}
          name='username'
          render={({ field }) => (
            <TextField
              {...field}
              error={Boolean(errors.username?.message)}
              helperText={errors.username?.message?.toString()}
              variant='outlined'
              margin='normal'
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Email />
                  </InputAdornment>
                ),
              }}
              label='Username'
              autoComplete='email'
              autoFocus
            />
          )}
        ></Controller>

        {/* Password */}
        <Controller
          control={control}
          name='password'
          render={({ field }) => (
            <TextField
              {...field}
              error={Boolean(errors.password?.message)}
              helperText={errors.password?.message?.toString()}
              variant='outlined'
              margin='normal'
              fullWidth
              type='password'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Password />
                  </InputAdornment>
                ),
              }}
              label='Password'
              autoComplete='password'
              autoFocus
            />
          )}
        ></Controller>

        {reducer.status == "failed" && (
          <Alert severity='error'>Register Failed</Alert>
        )}

        <Button
          className='mt-8'
          type='submit'
          fullWidth
          variant='contained'
          color='primary'
          disabled={reducer.status == "fetching"}
        >
          Create
        </Button>
        <Button
          className='mt-4'
          onClick={() => {
            dispatch(add());
            router.push("/login");
          }}
          type='button'
          fullWidth
          variant='outlined'
        >
          Cancel
        </Button>
      </form>
    );
  };

  return (
    <Box className='flex justify-center items-center'>
      <Card elevation={7} className='max-w-[345px] mt-[100px]'>
        <CardContent>
          <Typography gutterBottom variant='h5' component='h2'>
            Register ({reducer.count})
          </Typography>
          {showForm()}
        </CardContent>
      </Card>
      <style jsx global>
        {`
          body {
            min-height: 100vh;
            position: relative;
            margin: 0;
            background-size: cover;
            background-image: url("/static/img/bg4.jpg");
            text-align: center;
          }
        `}
      </style>
    </Box>
  );
}
