import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import { useEffect } from 'react'
import { api } from '../src/lib/api'
import { View, TouchableOpacity, Text } from 'react-native'

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/bfcb16ffee89846fcdfa',
}

export default function App() {
  const router = useRouter()

  const [, response, signInWithGithub] = useAuthRequest(
    {
      clientId: 'bfcb16ffee89846fcdfa',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime',
      }),
    },
    discovery,
  )

  useEffect(() => {
    //    console.log(
    //      makeRedirectUri({
    //        scheme: 'nlwspacetime',
    //      }),
    //    )

    async function handleGithubOAuthCode(code: string) {
      const response = await api.post('/register', {
        code,
      })

      const { token } = response.data

      SecureStore.setItemAsync('token', token)

      router.push('/memories')
    }

    if (response?.type === 'success') {
      const { code } = response.params

      handleGithubOAuthCode(code)
    }
  }, [response])

  return (
    // h-full
    <View className="flex-1 items-center px-10 py-10">
      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo />
        <View>
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-2"
          onPress={() => signInWithGithub()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            Cadastrar Lembrança
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>
    </View>
  )
}
