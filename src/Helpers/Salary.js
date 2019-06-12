const inssTable_2019 = [
  {
    up_to: 1751.81,
    rate: 8
  },
  {
    up_to: 2919.72,
    rate: 9
  },
  {
    up_to: 5839.45,
    rate: 11
  },
  {
    up_to: Number.MAX_SAFE_INTEGER,
    rate: 11
  }
];

const irpfTable_2019 = [
  {
    up_to: 1903.98,
    rate: 0,
    deduction: 0
  },
  {
    up_to: 2826.65,
    rate: 7.5,
    deduction: 142.8
  },
  {
    up_to: 3751.05,
    rate: 15.0,
    deduction: 354.8
  },
  {
    up_to: 4664.68,
    rate: 22.5,
    deduction: 636.13
  },
  {
    up_to: Number.MAX_SAFE_INTEGER,
    rate: 27.5,
    deduction: 869.36
  }
];

const capInss2019 = 570.88;

export class Salary {
  /**
   *
   * @param {number} O
   */

  constructor(GrossSalary) {
    this._grossSalary = undefined;
    this._inssBasis = undefined;
    this._inssDescount = undefined;
    this._irpfBasis = undefined;
    this._irpfDescount = undefined;
    this._netSalary = undefined;

    this._validateGrossSalary(GrossSalary);
    this._realizeCalcs();

    Object.freeze(this);
  }

  _validateGrossSalary(GrossSalary) {
    if (
      GrossSalary === undefined ||
      typeof GrossSalary !== "number" ||
      GrossSalary < 0
    )
      throw new Error(
        "The parameter of gross salary " +
          "is required and must be a " +
          "value of type number bigger than or equal to 0!"
      );

    this._grossSalary = GrossSalary;
  }

  _realizeCalcs() {
    this._inssBasis = this._grossSalary;
    this._inssDescount = this._calculateDiscountINSS();
    this._irpfBasis = this._grossSalary - this._inssDescount;
    this._irpfDescount = this._calculateDiscountIRPF();
    this._netSalary =
      this._grossSalary - this._inssDescount - this._irpfDescount;
  }

  _calculateDiscountINSS() {
    let descount = 0;

    for (let item of inssTable_2019) {
      if (this._inssBasis <= item.up_to) {
        descount = Math.min(this._inssBasis * (item.rate / 100), capInss2019);

        break;
      }
    }

    return descount;
  }

  _calculateDiscountIRPF() {
    let descount = 0;

    for (let item of irpfTable_2019) {
      if (this._irpfBasis <= item.up_to) {
        descount = this._irpfBasis * (item.rate / 100);
        descount -= item.deduction;
        break;
      }
    }

    return descount;
  }

  get grossSalary() {
    return this._grossSalary;
  }

  get inssBasis() {
    return this._inssBasis.toFixed(2);
  }

  get inssDescount() {
    return this._inssDescount.toFixed(2);
  }

  get irpfBasis() {
    return this._irpfBasis.toFixed(2);
  }

  get irpfDescount() {
    return this._irpfDescount.toFixed(2);
  }

  get netSalary() {
    return this._netSalary.toFixed(2);
  }
}
