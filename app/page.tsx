import { redirect } from "next/navigation";
import Form from 'next/form'


export default function Home() {

  const handleFormSubmit = async (formData: FormData) => {
    "use server";
    return redirect(`/${formData.get("handle")}`)
  }

  return (
    <main className="flex justify-center items-center p-8 min-h-screen">
      <div className="flex flex-col items-center justify-center gap-4 w-full max-w-xl">
        <h1 className="text-4xl font-bold">Tweet analyzer POC</h1>
        <p className="text-lg">Enter a Twitter handle to analyze latest tweets</p>
        <Form action={handleFormSubmit} className="flex items-center gap-2 w-full">
          <input name="handle" required type="text" placeholder="Enter a Twitter handle" className="w-full rounded-lg border border-gray-300 p-4 text-gray-900 focus:border-blue-500 focus:ring-blue-500" />
          <button className="bg-black rounded-lg p-4 text-white">Analyze</button>
        </Form>
      </div>
    </main>
  );
}
