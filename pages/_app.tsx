import { appWithTranslation } from 'next-i18next';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import GlobalErrors from '../components/globalErrors';   

const Santuario = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <GlobalErrors errorMessage={pageProps.errorMessage}>  {  }
        <Component {...pageProps} />
      </GlobalErrors>
    </SessionProvider>
  );
};

export default appWithTranslation(Santuario);
