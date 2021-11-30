import { useSelector } from 'react-redux';

export function useSolAccount() {
  const solAddress = useSelector((state: any) => {
    return state.rSOLModule.solAccount && state.rSOLModule.solAccount.address;
  });

  return { solAddress };
}
