// reusable/ConfirmToast.tsx

import { toast } from "react-hot-toast";

export function confirmToast(message: string, onConfirm: () => void) {
  toast.custom((t) => (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4 max-w-sm w-full">
      <p className="text-slate-800 font-medium mb-2">{message}</p>
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
        >
          Anulo
        </button>
        <button
          onClick={() => {
            toast.dismiss(t.id);
            onConfirm();
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Fshij
        </button>
      </div>
    </div>
  ));
}
