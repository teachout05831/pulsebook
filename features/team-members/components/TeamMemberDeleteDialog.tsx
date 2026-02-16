'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import type { TeamMember } from '../types';

interface Props {
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  deletingMember: TeamMember | null;
  handleDelete: () => void;
}

export function TeamMemberDeleteDialog({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  deletingMember,
  handleDelete,
}: Props) {
  return (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Team Member</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{deletingMember?.name}&quot;? This action cannot be undone.
            Consider deactivating the team member instead if you want to preserve their history.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
