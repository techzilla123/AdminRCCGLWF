import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Search, Plus, Edit, Trash2, FileText, Calendar, User, Image } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { blogAPI } from '../utils/api';
import { toast } from 'sonner@2.0.3';

export function Blog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [blogList, setBlogList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<any>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    author: '',
    excerpt: '',
    bannerImage: ''
  });

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      setIsLoading(true);
      const posts = await blogAPI.getAll();
      console.log('Loaded blog posts:', posts);
      setBlogList(posts || []);
    } catch (error: any) {
      console.error('Error loading blog posts:', error);
      toast.error(error.message || 'Failed to load blog posts');
      // Set empty array on error so the UI still renders
      setBlogList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPost = async () => {
    if (newPost.title && newPost.content && newPost.author) {
      try {
        const post = await blogAPI.add(newPost);
        setBlogList([...blogList, post]);
        setNewPost({ title: '', content: '', author: '', excerpt: '', bannerImage: '' });
        setIsAddDialogOpen(false);
        toast.success('Blog post created successfully!');
      } catch (error: any) {
        console.error('Error adding blog post:', error);
        toast.error(error.message || 'Failed to create blog post');
      }
    }
  };

  const handleEditPost = (post: any) => {
    setSelectedPost(post);
    setNewPost({
      title: post.title,
      content: post.content,
      author: post.author,
      excerpt: post.excerpt || '',
      bannerImage: post.bannerImage || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdatePost = async () => {
    if (selectedPost && newPost.title && newPost.content && newPost.author) {
      try {
        const updated = await blogAPI.update(selectedPost.id, newPost);
        const updatedPosts = blogList.map(post =>
          post.id === selectedPost.id ? updated : post
        );
        setBlogList(updatedPosts);
        setNewPost({ title: '', content: '', author: '', excerpt: '', bannerImage: '' });
        setSelectedPost(null);
        setIsEditDialogOpen(false);
        toast.success('Blog post updated successfully!');
      } catch (error: any) {
        console.error('Error updating blog post:', error);
        toast.error(error.message || 'Failed to update blog post');
      }
    }
  };

  const handleDeletePost = async () => {
    if (postToDelete) {
      try {
        await blogAPI.delete(postToDelete.id);
        setBlogList(blogList.filter(post => post.id !== postToDelete.id));
        setDeleteConfirmOpen(false);
        setPostToDelete(null);
        toast.success('Blog post deleted successfully!');
      } catch (error: any) {
        console.error('Error deleting blog post:', error);
        toast.error(error.message || 'Failed to delete blog post');
      }
    }
  };

  const confirmDelete = (post: any) => {
    setPostToDelete(post);
    setDeleteConfirmOpen(true);
  };

  const filteredPosts = blogList.filter(post =>
    post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPosts = blogList.length;
  const thisMonthPosts = blogList.filter(post => {
    const postDate = new Date(post.createdAt);
    const now = new Date();
    return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Blog</h1>
          <p className="text-muted-foreground">
            Manage blog posts and articles
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Blog Post</DialogTitle>
              <DialogDescription>
                Write a new blog post or article for your church community.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="Enter post title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">
                  Author <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="author"
                  value={newPost.author}
                  onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                  placeholder="Enter author name"
                />
              </div>

              <div className="space-y-2">
                <ImageUpload
                  label="Banner Image"
                  value={newPost.bannerImage}
                  onChange={(url) => setNewPost({ ...newPost, bannerImage: url })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">
                  Excerpt
                </Label>
                <Textarea
                  id="excerpt"
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                  placeholder="Brief summary of the post (optional)"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">
                  Content <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Write your blog post content..."
                  rows={8}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPost}>
                Publish Post
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
            <p className="text-xs text-muted-foreground">All published posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisMonthPosts}</div>
            <p className="text-xs text-muted-foreground">Posts this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {blogList.length > 0 ? new Date(blogList[blogList.length - 1]?.createdAt).toLocaleDateString() : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Last post date</p>
          </CardContent>
        </Card>
      </div>

      {/* Blog Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
          <CardDescription>
            Manage and edit your blog posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading blog posts...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No blog posts found. Create your first post to get started!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Banner</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Excerpt</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      {post.bannerImage ? (
                        <img
                          src={post.bannerImage}
                          alt={post.title}
                          className="h-12 w-20 object-cover rounded"
                        />
                      ) : (
                        <div className="h-12 w-20 bg-muted rounded flex items-center justify-center">
                          <Image className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{post.title}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-sm text-muted-foreground">
                        {post.excerpt || post.content?.substring(0, 60) + '...'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">
                        Published
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEditPost(post)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => confirmDelete(post)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Post Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>
              Update your blog post details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="Enter post title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-author">
                Author <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-author"
                value={newPost.author}
                onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                placeholder="Enter author name"
              />
            </div>

            <div className="space-y-2">
              <ImageUpload
                label="Banner Image"
                value={newPost.bannerImage}
                onChange={(url) => setNewPost({ ...newPost, bannerImage: url })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-excerpt">
                Excerpt
              </Label>
              <Textarea
                id="edit-excerpt"
                value={newPost.excerpt}
                onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                placeholder="Brief summary of the post (optional)"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-content">
                Content <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="edit-content"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Write your blog post content..."
                rows={8}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePost}>
              Update Post
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{postToDelete?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
