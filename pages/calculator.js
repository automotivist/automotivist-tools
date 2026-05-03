// pages/calculator.js
import Layout from '../components/Layout';
import Calculator from '../components/Calculator';
export default function CalculatorPage() {
  return (<Layout title="Car Ownership Score Calculator" description="What is your car actually costing you?" canonical="https://tools.automotivist.com/calculator"><div style={{background:'var(--dark-bg)',paddingTop:52,paddingBottom:0}}><div className="container-sm" style={{textAlign:'center'}}><div className="eyebrow" style={{marginBottom:14}}>Free Tool</div><h1 className="h-display">What is your car <em>actually costing you?</em></h1></div><div style={{height:48,background:'linear-gradient(to bottom,var(--dark-bg),#EDE8E0)',marginTop:40}} /></div><div style={{background:'#EDE8E0',paddingBottom:80}}><div className="container-sm"><Calculator slug="calculator" /></div></div></Layout>);
}
