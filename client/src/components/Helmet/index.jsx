
import { Container } from 'reactstrap';

const Helmet = (props) => {

  document.title= `Real-Estate - ${props.title}`
  return <Container>
    <div>
      {props.children}
    </div>
  </Container>
}

export default Helmet;
