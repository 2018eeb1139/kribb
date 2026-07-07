import { useAuth, useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUp() {
  const { signIn, errors, fetchStatus } = useSignIn();

  const { isLoaded, isSignedIn } = useAuth();

  const router  = useRouter();

  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code,setCode] = useState("")


  const isLoading = fetchStatus === "fetching";


  const onSignInPress = async()=>{
    const { error } = await signIn.password({
      emailAddress:email,
      password,
    })
    if(error){
      alert(error.message)
    }
    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask)
            return
          }
          const url = decorateUrl('/') 
          router.push(url as any)
        
        },
      })
    } else if (signIn.status === 'needs_second_factor') {
      await signIn.mfa.sendPhoneCode()
    } else if (signIn.status === 'needs_client_trust') {

      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === 'email_code',
      )

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode()
      }
    } else {
      // console.error('Sign-in attempt not complete:', signIn)
    }
  }

  const onVerifyPress = async () => {
    await signIn.mfa.verifyEmailCode({ code })

    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
         
          if (session?.currentTask) {
            console.log(session?.currentTask)
            return
          }
          const url = decorateUrl('/')
          router.push(url as any)
         
        },
      })
    } else {
      // Check why the sign-in is not complete
      // console.error('Sign-in attempt not complete:', signIn)
    }
  }


  if (
    signIn.status === 'needs_client_trust')
   {
    return (
      <View className="flex-1 justify-center px-6 py-12">
        <Image
          source={require("../../assets/images/react-logo.png")}
          className="mb-8 mx-auto"
          resizeMode="contain"
        />
        <Text className="text-3xl text-center font-bold text-gray-800 mb-2">
          Verify your account
        </Text>
        <Text className="text-gray-500 text-center mb-8">
          We have sent an OTP to {email}
        </Text>

        <TextInput
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
          placeholder="Enter the OTP"
          value={code}
          onChangeText={setCode}
          placeholderTextColor="#9CA3AF"
          autoCapitalize="words"
          keyboardType="number-pad"
        />
        {errors.fields.code && (
          <Text className="text-red-500 mb-4">
            {errors.fields.code.message}
          </Text>
        )}
        <TouchableOpacity
          onPress={onVerifyPress}
          disabled={isLoading}
          className="w-full bg-blue-600 py-4 rounded-xl items-center mb-4"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-base font-bold">Verify OTP</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => signIn.mfa.sendEmailCode()}

          className="py-2"
        >
          <Text className="text-base font-bold">
            Didn't Recieve the OTP?{" "}
            <Text className="text-blue-600">Resend OTP</Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-white"
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 justify-center px-6 py-12">
        <Image
          source={require("../../assets/images/react-logo.png")}
          className="mb-8 mx-auto"
          resizeMode="contain"
        />
        <Text className="text-3xl text-center font-bold text-gray-800 mb-2">
          Welcome Back!
        </Text>
        <Text className="text-gray-500 text-center mb-8">
          Sign In to your account
        </Text>
      
        <TextInput
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 "
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.fields.identifier && (
          <Text className="text-red-500 mb-4">
            {errors.fields.identifier.message}
          </Text>
        )}
        <TextInput
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 "
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#9CA3AF"
          secureTextEntry
        />
        {errors.fields.password && (
          <Text className="text-red-500 mb-4">
            {errors.fields.password.message}
          </Text>
        )}
        <TouchableOpacity
          onPress={onSignInPress}
          disabled={isLoading}
          className="w-full bg-blue-600 py-4 rounded-xl items-center mb-4"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-base font-bold">Sign In</Text>
          )}
        </TouchableOpacity>
        <View className="flex-row justify-center">
          <Text className="text-gray-500">
            Didn't Have an Account?{" "}
            <Link href="/sign-up">
              <Text className="text-blue-600 font-semibold">Sign Up</Text>
            </Link>
          </Text>
        </View>
        <View nativeID="clerk-captcha" />
      </View>
    </ScrollView>
  );
}
