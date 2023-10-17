'use client'
import { useContractWrite, useAccount, useContractEvent } from 'wagmi'
import NFT from '../../artifacts/contracts/CryptoAqsha.sol/CryptoAqsha.json'
import { toast } from 'react-toastify';
import { NFTStorage, File } from 'nft.storage'
import { useState  } from 'react'
import { ImSpinner } from "react-icons/im";
import { useRouter } from 'next/navigation';


export default function Home() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const NFT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQ4QTNDN0I4MTU0MDQwMjdBODlFMDc2NzA2MjI3YkM4RmZFYzk3NTMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY5NzM2OTg5ODM5MiwibmFtZSI6IkFzc2lnbm1lbnRfMyJ9.3_s4cf-iUnPNlwO2pq_VFnj9pBV0EXUekZpeNEafaKw'
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })
  const { address } = useAccount()

  const { data, isSuccess, write } = useContractWrite({
    address: '0x7Cc4390fa2557AA795467059dA753d76DeE71C35', // Remix
    abi: NFT.abi,
    functionName: 'safeMint'
  })


  useContractEvent({
    address: '0x7Cc4390fa2557AA795467059dA753d76DeE71C35',
    abi: NFT.abi,
    eventName: 'NFTCreated',
    listener(log) {
      toast.success('NFT has been succesfully created!')
      setIsLoading(false)
      router.push('/')
    },
  })

  async function uploadNFT() {
    setIsLoading(true)
    const imageFile = new File([file], 'nft.png', { type: 'image/png' })
    const metadata = await client.store({
      name: name,
      description: description,
      image: imageFile
    })
    write({
      args: [address, metadata?.url]
    })
  }
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-between p-24">
      <div className="flex flex-col h-48 w-full items-center gap-4 justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
        <input type="text" id="default-input" placeholder='Give your NFT name' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={(e) => { setName(e.target.value) }}
        />

        <textarea id="message" rows="4" className="block p-2.5 w-full text-sm resize-none text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your description here..."
          onChange={(e) => { setDescription(e.target.value) }}
        ></textarea>

        <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file"
          onChange={(e) => { if (e.target.files) { setFile(e.target.files[0]) } }} />
        <button type="submit" className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900" onClick={uploadNFT}>
          {
            isLoading ? (
              <ImSpinner className=' animate-spin' />
            )
              :
              (
                <p>Upload</p>
              )
          }
        </button>
      </div>

    </main>
  )
}
