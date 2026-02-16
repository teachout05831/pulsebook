'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { TeamMember, TeamMemberFormData } from '../types';

const emptyForm: TeamMemberFormData = {
  name: '',
  email: '',
  phone: '',
  role: 'technician',
};

export function useTeamMembers(initialMembers: TeamMember[]) {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<TeamMemberFormData>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenAdd = useCallback(() => {
    setEditingMember(null);
    setFormData(emptyForm);
    setIsDialogOpen(true);
  }, []);

  const handleOpenEdit = useCallback((member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone || '',
      role: member.role,
    });
    setIsDialogOpen(true);
  }, []);

  const handleOpenDelete = useCallback((member: TeamMember) => {
    setDeletingMember(member);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const url = editingMember
        ? `/api/team-members/${editingMember.id}`
        : '/api/team-members';
      const method = editingMember ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok || result.error) {
        toast.error(result.error || 'Failed to save team member');
        return;
      }

      if (editingMember) {
        setMembers(prev =>
          prev.map(m => m.id === editingMember.id ? { ...m, ...result.data } : m)
        );
      } else if (result.data) {
        setMembers(prev => [...prev, result.data]);
      } else {
        const listRes = await fetch('/api/team-members');
        const listData = await listRes.json();
        setMembers(listData.data);
      }

      toast.success(editingMember ? 'Team member updated' : 'Team member created');
      setIsDialogOpen(false);
    } catch {
      toast.error('Failed to save team member');
    } finally {
      setIsSaving(false);
    }
  }, [editingMember, formData]);

  const handleDelete = useCallback(async () => {
    if (!deletingMember) return;
    const prev = members;
    setMembers(p => p.filter(m => m.id !== deletingMember.id));
    setIsDeleteDialogOpen(false);

    try {
      const res = await fetch(`/api/team-members/${deletingMember.id}`, {
        method: 'DELETE',
      });

      const result = await res.json();

      if (!res.ok || result.error) {
        setMembers(prev);
        toast.error(result.error || 'Failed to delete team member');
        setIsDeleteDialogOpen(true);
        return;
      }

      toast.success('Team member deleted');
      setDeletingMember(null);
    } catch {
      setMembers(prev);
      toast.error('Failed to delete team member');
      setIsDeleteDialogOpen(true);
    }
  }, [deletingMember, members]);

  const handleToggleStatus = useCallback(async (member: TeamMember) => {
    setMembers(prev =>
      prev.map(m => (m.id === member.id ? { ...m, isActive: !m.isActive } : m))
    );

    try {
      const res = await fetch(`/api/team-members/${member.id}/toggle-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !member.isActive }),
      });

      const result = await res.json();

      if (!res.ok || result.error) {
        setMembers(prev =>
          prev.map(m => (m.id === member.id ? { ...m, isActive: member.isActive } : m))
        );
        toast.error(result.error || 'Failed to update status');
        return;
      }

      toast.success(`Team member ${!member.isActive ? 'activated' : 'deactivated'}`);
    } catch {
      setMembers(prev =>
        prev.map(m => (m.id === member.id ? { ...m, isActive: member.isActive } : m))
      );
      toast.error('Failed to update status');
    }
  }, []);

  return {
    members, isDialogOpen, isDeleteDialogOpen, editingMember, deletingMember,
    formData, isSaving, setFormData, setIsDialogOpen, setIsDeleteDialogOpen,
    handleOpenAdd, handleOpenEdit, handleOpenDelete, handleSave, handleDelete, handleToggleStatus,
  };
}
