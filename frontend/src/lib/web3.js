import api from "@/lib/api";

export const hasMetaMask = () =>
  typeof window !== "undefined" && typeof window.ethereum !== "undefined";

export async function siweLogin() {
  if (!hasMetaMask()) {
    throw new Error("MetaMask is not installed. Get it at metamask.io");
  }

  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  if (!accounts?.length) throw new Error("No account selected");
  const address = accounts[0];

  const { data: nonceRes } = await api.post("/siwe/nonce", { address });
  const { nonce, message } = nonceRes;

  const signature = await window.ethereum.request({
    method: "personal_sign",
    params: [message, address],
  });

  const { data: verifyRes } = await api.post("/siwe/verify", {
    address,
    signature,
    nonce,
  });

  return verifyRes;
}
