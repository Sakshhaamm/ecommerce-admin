"use client";

import { useRouter } from "next/navigation";

export default function DeleteBtn({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure?");
    
    if (confirmed) {
      // Call our new DELETE API
      const res = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Refresh the page to show the item is gone
        router.refresh();
      } else {
        alert("Failed to delete");
      }
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      className="text-red-500 hover:text-red-700 font-bold"
    >
      Delete
    </button>
  );
}