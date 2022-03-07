export function saveAddress(addresses, address) {
  if (address.id) {
    // Update record
    const index = addresses.findIndex((adr) => {
      return adr.id === +address.id;
    });
    address.id = +address.id;
    addresses[index] = address;
  } else {
    // Create record
    const nextId = Math.max(...addresses.map((address) => address.id)) + 1;
    address.id = nextId;
    addresses.push(address);
  }
  return addresses;
}