//Elementos que usaremos para conectar Moralis. 
const appId = "n3rg89swjLYr3w8QJApUcBJ8XpNlLPYdllWTFuqY"; 
const serverUrl = "https://m02z2ncyupuz.bigmoralis.com:2053/server";

//Elementos que usaremos para conectar la web3. 
let web3; 
const CONTRACT_ADDRESS_LAUNCH = "0x4ae8d2756ab677C909b539E981Df865277706D44"; //Está en Rinkeby, si lo usas en otra red te regresará vacio.


//És necesario iniciar Moralis con start paara cualquier operación. 
//Y todo lo que se hace aquí es con Moralis, no hay nada que se haga directo a la web3. 
objeto = Moralis.start({ serverUrl, appId });
console.log("El servidor se conectó a Moralis, comment over crear hasta fix red...");



async function login(){

  console.log("Entramos a launch...")
  
    let x = 0;
    console.log("Se imprimio el valor de x...")
    console.log(x);
  
  // The producing code (this may take some time)
  console.log("Estoy ejecutando el login()...")
  //Primero revisa si hay un usuario de Moralis que se haya conectado previamente. 
    let currentUser = Moralis.User.current();
    console.log("Usuario Actual:")
    console.log(currentUser);
    //Éste bloque es para poner alguna acción que quieras que haga al detectar que no hay un user de Moralis, 
    //..previamente conectados.
    if(!currentUser){
        //windows.location.pathname = "/index.html";
        console.log("Como no hay usuario abriré Metamask para que se conecte...");

      try {

        console.log("Me estoy conectando ahora a la Web3...")
        web3 = await Moralis.Web3.enable(); 
        console.log("Conectados a Web3:");
        console.log(web3);
        console.log("Datos obtenidos de la cadena:")
        const chainIdHex = await web3.currentProvider.chainId;
        const chainIdDec = await web3.eth.getChainId();
        console.log(chainIdHex);
        console.log(chainIdDec);
        console.log("Cambiaremos x a uno para indicar que nos logueamos.")
        x = 1; 
        console.log("Esto es x:");
        console.log(x);
        
        try{
        await web3.currentProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x61" }],
        });
        console.log("Cambiamos de red correctamente...")
      }catch (error) {
        if (error.code === 4902) {
          try {
            console.log("Creando la red BSC...")
            await web3.currentProvider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                      chainId: '0x38',
                    chainName: 'Binance Smart Chain',
                    nativeCurrency: {
                        name: 'Binance Coin',
                        symbol: 'BNB',
                        decimals: 18,
                  },
                  rpcUrls: ['https://bsc-dataseed.binance.org/'],
                  blockExplorerUrls: ['https://bscscan.com']
                },
              ],
            });
          } catch (error) {
            alert(error.message);
          }
                  }
      }
     
      console.log("Aqui llegamos si todo funcionó correctamente...");
      //fakeProcess(); 
      //crear();
       
    }
     catch (error) {
          //Esto saca un prompt alertando que no estás conectado via Metamask o lo que sea.      
          //alert(error.message);
          console.log(error);
          console.log(error.message);
          console.log("A éste punto llegamos cuando el usuario cancelo o cerro su ventana de MM antes de loguearse.")
             }
  
}
}




  async function crear(){

    //Lo primero que hago es obtener los valores que el usuario ya introdujo.
    //let name = document.getElementById("field1").value //Aquí iría un elemento que cachamos q varia según ambiente.
    let name = document.getElementById("field1").value
    let symbol = document.getElementById("field2").value
    let amount = document.getElementById("field3").value
    console.log(name); 
    console.log(symbol); 
    console.log(amount); 
    console.log("Si captura los valores...")
    console.log(web3);
    console.log("El anterior indica si existe web3");
   
    try {

    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS_LAUNCH);
    console.log("Contrato:");
    console.log(contract);
    console.log(name);
    console.log(symbol);
    console.log(amount);
    console.log("Los valores si fueron obtenidos..");
    console.log(contract.methods);
    console.log(accounts[0]);
    
    resultado = await contract.methods.createToken(amount, name, symbol).send({from: accounts[0], value: Moralis.Units.ETH("0.001")})
    .on("transactionHash", (hash) => { console.log(hash) })
    .on("receipt", (receipt) => {console.log(receipt) })
    .on("error", (error) => { console.log(error) })
    //.on("confirmation", (confirmationNumber, receipt) => { console.log(confirmationNumber) })
    
    console.log("Esto es el resultado ahora si...")
    console.log(resultado.events);

    // const printAddress = async () => {
    //   const a = await resultado;
  
    //   console.log("Evento:");
    //   console.log(a.events[0]);
    //   console.log("Contrato de tu nuevo token:");
    //   console.log(a.events[0].address);
    //   console.log("Creado en el bloque:");
    //   console.log(a.events[0].blockNumber);
    // };
  
    // printAddress();
    
          
    
    // .on("receipt", function(receipt)
    // {
    //     console.log("Esto es el resultado:")
    //     console.log(receipt.blockNumber); 
    //     console.log(receipt);
    //     console.log(resultado);
    }
  catch (error) {
    console.log(error.message);
  }
 


  
//contract.methods.payout().send({from: accounts[0], value: Moralis.Units.ETH("0")})

}

