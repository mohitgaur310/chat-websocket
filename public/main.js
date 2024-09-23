const socket = io();

const clientsTotal = document.getElementById("client-total");

socket.on("total_client", (data) => {
  clientsTotal.innerText = `Total Clients :${data}`;
});
