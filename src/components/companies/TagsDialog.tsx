"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Badge } from "../ui/badge"
import { X } from "lucide-react"
import type { Company } from "../../lib/types"

interface TagsDialogProps {
  company: Company | null
  isOpen: boolean
  onClose: () => void
  onSave: (tags: string[]) => void
}

export function TagsDialog({ company, isOpen, onClose, onSave }: TagsDialogProps) {
  const [currentTags, setCurrentTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  useEffect(() => {
    if (company && company.tags) {
      setCurrentTags(company.tags)
    } else {
      setCurrentTags([])
    }
  }, [company])

  const handleAddTag = () => {
    if (newTag.trim()) {
      setCurrentTags([...currentTags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setCurrentTags(currentTags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSave = () => {
    onSave(currentTags)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Etiquetas</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="newTag">Agregar etiqueta</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="newTag"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nueva etiqueta"
              />
              <Button onClick={handleAddTag}>Agregar</Button>
            </div>
          </div>
          <div>
            <Label>Etiquetas actuales</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {currentTags.length === 0 ? (
                <p className="text-sm text-gray-500">No hay etiquetas</p>
              ) : (
                currentTags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:bg-gray-200 rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button onClick={handleSave}>Guardar</Button>
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
