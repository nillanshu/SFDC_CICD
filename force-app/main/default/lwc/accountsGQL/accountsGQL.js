// accountsMinAmount.js
import { LightningElement, wire } from "lwc";
import { gql, graphql } from "lightning/uiGraphQLApi";

export default class AccountsGQL extends LightningElement {
  records;
  errors;

  minAmount = "50000000";

  minAmounts = [
    { label: "All", value: "0" },
    { label: "$5,000,000", value: "5000000" },
    { label: "$50,000,000", value: "50000000" },
    { label: "$500,000,000", value: "500000000" },
  ];

  @wire(graphql, {
    query: gql`
      query bigAccounts($minAmount: Currency) {
        uiapi {
          query {
            Account(where: { AnnualRevenue: { gte: $minAmount } }) {
              edges {
                node {
                  Id
                  Name {
                    value
                  }
                  AnnualRevenue {
                    displayValue
                  }
                  Contacts {
                    edges {
                      node {
                        Id
                        Name {
                          value
                        }
                      }
                    }
                  }
              }
            }
          }
        }
      }
    }`,
    // Use a getter function (see get variables() below)
    // to make the variables reactive.
    variables: "$variables",

    // The operation name is optional
    // since the GraphQL query defines a single operation only.
    operationName: "bigAccounts",
  })
  graphqlQueryResult({ data, errors }) {
    if (data) {
      this.records = data.uiapi.query.Account.edges.map((edge) => edge.node);
    }
    this.errors = errors;
  }

  get variables() {
    return {
      minAmount: this.minAmount,
    };
  }

  handleMinAmountChange(event) {
    this.minAmount = event.detail.value;
  }
}