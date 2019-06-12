import React, { Component, Fragment } from "react";
import { Salary } from "./Helpers/Salary";
import { Inputs } from "./Components/Inputs";
import { interval } from "rxjs";
import { takeUntil, map, filter } from "rxjs/operators";

import "./App.css";
import logo from "./logo.svg";

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      salary: new Salary(0),
      desiredNetSalary: 4000
    };
  }

  updateGrossSalary = event => {
    const number = +event.target.value;
    this.setState({ salary: new Salary(number) });
  };

  formatGrossSalary = number => {
    return Math.floor(number) !== +number ? +number.toFixed(2) : +number;
  };

  toCurrency = number => {
    const formatter = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
    return formatter.format(number);
  };

  updateDesiredNetSalary = event => {
    this.setState({ desiredNetSalary: +event.target.value });
  };

  findGrossSalaryFromNetSalary = () => {
    this.setState({ salary: new Salary(+this.state.desiredNetSalary) });
    const obs$ = interval(1).pipe(
      map(() => {
        const currentValue = this.state.salary.netSalary;

        const difference = Math.abs(
          currentValue - +this.state.desiredNetSalary
        );

        const increment = difference >= 5 ? 1 : 0.01;

        this.setState({
          salary: new Salary(+this.state.salary.grossSalary + increment)
        });

        return this.state.salary.netSalary;
      })
    );

    const match$ = obs$.pipe(
      filter(currentValue => +currentValue >= this.state.desiredNetSalary)
    );

    obs$.pipe(takeUntil(match$)).subscribe();
  };

  render() {
    return (
      <Fragment>
        <header className="header">
          <img src={logo} alt="logo-react" />
          <h2>Cálculo de salário com React.js</h2>
        </header>
        <div className="main-container">
          <div className="inputs-container">
            <h2>Cálculo em Tempo Real</h2>
            <h3>Salário Bruto</h3>
            <Inputs
              currency={false}
              readOnly={false}
              inputValue={this.formatGrossSalary(this.state.salary.grossSalary)}
              onInputChange={this.updateGrossSalary}
            />
            <h3>Base INNS</h3>
            <Inputs
              isCurrency={true}
              readOnly={true}
              inputValue={this.toCurrency(this.state.salary.inssBasis)}
            />
            <h3>Desconto INNS</h3>
            <Inputs
              isCurrency={true}
              readOnly={true}
              inputValue={this.toCurrency(this.state.salary.inssDescount)}
            />
            <h3>Base IRPF</h3>
            <Inputs
              isCurrency={true}
              readOnly={true}
              inputValue={this.toCurrency(this.state.salary.irpfBasis)}
            />
            <h3>Desconto IRPF</h3>
            <Inputs
              isCurrency={true}
              readOnly={true}
              inputValue={this.toCurrency(this.state.salary.irpfDescount)}
            />
            <h3>Salário Liquído</h3>
            <Inputs
              isCurrency={true}
              readOnly={true}
              inputValue={this.toCurrency(this.state.salary.netSalary)}
            />
          </div>
          <div className="obs-container">
            <h2>Cálculo reverso com Observables</h2>
            <h3>Salário Liquído Desejado</h3>
            <Inputs
              isCurrency={false}
              readOnly={false}
              inputValue={this.state.desiredNetSalary}
              onInputChange={this.updateDesiredNetSalary}
            />
            <button onClick={this.findGrossSalaryFromNetSalary}>
              Calcular Salário Bruto Correspondente
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}
