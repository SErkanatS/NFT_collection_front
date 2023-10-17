'use client'
import { useAccount, useContractEvent, useContractRead, useContractWrite } from 'wagmi'
import NFT from '../../../artifacts/contracts/CryptoAqsha.sol/CryptoAqsha.json'
import { useState, useEffect } from 'react'
import axios from 'axios';
import { ImSpinner } from 'react-icons/im';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';


export default function Home({ params }) {
  const id = +params.id
  const router = useRouter()

  const [toAddress, setAddress] = useState('')
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [show, setShow] = useState(false)


  const { data } = useContractRead({
    address: '0x7Cc4390fa2557AA795467059dA753d76DeE71C35',
    abi: NFT.abi,
    functionName: 'getTokensForAddress',
    args: [address],
  });

  const NFT_ID = useContractRead({
    address: '0x7Cc4390fa2557AA795467059dA753d76DeE71C35',
    abi: NFT.abi,
    functionName: 'getTokenIdByURI',
    args: [data[id]],
  });


  const { isSuccess, write } = useContractWrite({
    address: '0x7Cc4390fa2557AA795467059dA753d76DeE71C35', // Remix
    abi: NFT.abi,
    functionName: 'safeTransferFrom',
    args: [address, toAddress, NFT_ID?.data],
  })

  const { isSuccess:isBurned, write:burn } = useContractWrite({
    address: '0x7Cc4390fa2557AA795467059dA753d76DeE71C35', // Remix
    abi: NFT.abi,
    functionName: 'burn',
    args: [NFT_ID?.data],
  })


  useEffect(() => {

    if (isBurned === true) {
      toast.success('NFT has been succesfully burned!')
      setIsLoading(false)
      router.push('/')
    }

  }, [isBurned]);


  useEffect(() => {

    if (isSuccess === true) {
      toast.success('NFT has been succesfully transfered!')
      setIsLoading(false)
      router.push('/')
    }

  }, [isSuccess]);

  const [nftData, setNftData] = useState([]);

  useEffect(() => {
    const fetchImageURLs = async () => {
      try {
        const response = await axios.get(data[id].replace('ipfs:/', 'https://ipfs.io/ipfs'));
        console.log('response', response)
        if (response.status === 200) {
          const metadata = response.data;
          const nftData = {
            image: metadata.image.replace('ipfs:/', 'https://ipfs.io/ipfs'),
            name: metadata.name,
            description: metadata.description,
          };
          console.log('nftData', nftData)
          setNftData(nftData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchImageURLs();
  }, [data]);



  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-between p-24">
      <div className="flex relative flex-col h-48 w-full items-center gap-4 justify-start lg:justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">

        <div key={1} class="w-full max-w-sm z-20 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-600 dark:border-gray-700">
          <img class="p-8 rounded-xl" src={nftData.image} alt='IPFS Image' />
          <div class="px-5 pb-5">
            <div class="flex items-center justify-between">
              <div>
                <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{nftData.name}</h5>
                <p className="text-gray-500 dark:text-gray-400">{nftData.description}</p>
              </div>
            </div>
          </div>
        </div>
        <div className=' flex gap-2 w-full' >
          <input type="text" id="default-input" placeholder='Address' className="bg-gray-50 border flex-1 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => { setAddress(e.target.value) }}
          />
          <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => {
            write()
            setIsLoading(true)
          }}>
            {isLoading ?
              (
                <ImSpinner className=' animate-spin' />
              )
              :
              (
                <p>Transfer</p>
              )
            }
          </button>

          <button data-modal-target="popup-modal" data-modal-toggle="popup-modal" type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={() => {
            setShow(true)
          }}>Burn</button>

        </div>
      </div>
      {show &&


        <div class="absolute w-full max-w-md max-h-full z-40">
          <div class=" absolute bg-white rounded-lg shadow dark:bg-gray-700">
            <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal" onClick={() => {
            setShow(false)
          }}>
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
            <div class="p-6 text-center">
              <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to burn this NFT?</h3>
              <button data-modal-hide="popup-modal" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2" 
              onClick={burn}>
                Yes, I'm sure
              </button>
              <button data-modal-hide="popup-modal" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600" onClick={() => {
            setShow(false)
          }}>No, cancel</button>
            </div>
          </div>
        </div>

      }
    </main>
  )
}
