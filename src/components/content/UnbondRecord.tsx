import leftArrowSvg from 'src/assets/images/left_arrow.svg';
import { HContainer, Text } from '../commonComponents';

type Props = {
  onClickBack: Function;
};

export const UnbondRecord = (props: Props) => {
  return (
    <div style={{ flex: 1 }}>
      <HContainer justifyContent='flex-start'>
        <img
          onClick={() => {
            props.onClickBack();
          }}
          src={leftArrowSvg}
          alt='back'
          style={{
            cursor: 'pointer',
          }}
        />

        <Text size='30px' bold color='white' ml='20px'>
          Unbonded Records
        </Text>
      </HContainer>
    </div>
  );
};
