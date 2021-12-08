import { useSelector } from 'react-redux';

export function useSolAccount() {
  const solAddress = useSelector((state: any) => {
    // return '7rc4VzogeBV8Wyww1mMshELNDZFa6YtWYfEXaD6chphn';
    return state.rSOLModule.solAddress;
  });

  return { solAddress };
}
