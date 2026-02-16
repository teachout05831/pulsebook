export interface CustomerNote {
  id: string;
  companyId: string;
  customerId: string;
  content: string;
  isPinned: boolean;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Joined data
  authorName?: string;
  authorInitials?: string;
}

export interface CreateNoteInput {
  customerId: string;
  content: string;
  isPinned?: boolean;
}

export interface UpdateNoteInput {
  content?: string;
  isPinned?: boolean;
}

export interface NoteActionResult {
  success?: boolean;
  error?: string;
  data?: CustomerNote;
}
