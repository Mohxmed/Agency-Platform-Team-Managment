"use client";

import Modal from "@/features/dashboard/ui/Modal";

export default function ProjectModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Project">
      <div className="py-10 text-center">Project Form Coming Soon...</div>
    </Modal>
  );
}
