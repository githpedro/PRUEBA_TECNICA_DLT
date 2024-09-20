import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';


const HomePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;  
    if (!session) {
      router.push('/auth/login');  
    }
  }, [session, status]);

  if (status === 'loading') {
    return <p>Cargando...</p>;  
  }

  return (
    <div className="home-page">
      <h1>Bienvenido al Santuario de Criaturas Mágicas</h1>
      <p>Administra tus criaturas mágicas de manera eficiente.</p>
      <Link href="/creatures" legacyBehavior>
        <a>Ir a las Criaturas</a>
      </Link>

    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default HomePage;
