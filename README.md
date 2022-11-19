# CHIKWAMA

In the world today, people are constantly moving. As the middle class grows in Africa more and more people are moving to the cities and moving to neighboring countries to seek economic opportunities, jobs or services, because of this the villages, towns, cities and countries where these people come from can also benefit economically from the money that these people send home.

Chikwama is a Decentralised Autonomous organisation that helps facilitate these remittances. This is done by aggregating cashpoints(locations where digital dollar pegged tokens can be exhanged for the local fiat and visa versa), and also providing user friendly access to the rails that facilitate said remittances.

# Setup 

CHIKWAMA is comprised of two applications which all reside in this monorepo.

- `CHIKWAMASITE/client` is the client-facing application 
- `CHIKWAMASITE/contracts` Contains the smart contract that facilitates all Chikwama transactions

## webapp

In a terminal, navigate to the `client` folder and run `pnpm i` to install dependencies and then `pnpm dev`. This builds the frontend code, and starts a web server that will automatically reflect any changes you make to the frontend.

Load the frontend app in your browser at http://localhost:5173.
 
