const { onRequest } = require('firebase-functions/v2/https');
const { admin } = require('../lib/firebase');
const { cors, ensureMethod } = require('../lib/http');
const { requireAuth, requireAdmin, verifyBearerToken } = require('../lib/auth');
const { escapeHtml, createSlug } = require('../lib/content');

const createBlogPost = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, 'POST')) {
      return;
    }

    try {
      const decodedToken = await requireAuth(req, res);
      if (!decodedToken) {
        return;
      }

      const { title, excerpt, content, category, tags, featuredImage, featured } = req.body;

      if (!title || !content || !category) {
        return res.status(400).json({ error: 'Title, content, and category are required' });
      }

      if (title.length > 300) return res.status(400).json({ error: 'Title must be under 300 characters' });
      if (content.length > 200000) return res.status(400).json({ error: 'Content must be under 200,000 characters' });
      if (excerpt && excerpt.length > 1000) return res.status(400).json({ error: 'Excerpt must be under 1,000 characters' });
      if (category.length > 100) return res.status(400).json({ error: 'Category must be under 100 characters' });
      if (Array.isArray(tags) && tags.length > 20) return res.status(400).json({ error: 'Maximum 20 tags allowed' });

      let slug = createSlug(title);

      const existingPost = await admin.firestore()
        .collection('blogPosts')
        .where('slug', '==', slug)
        .limit(1)
        .get();

      if (!existingPost.empty) {
        slug = `${slug}-${Date.now()}`;
      }

      const sanitizedData = {
        title: escapeHtml(title),
        slug,
        excerpt: excerpt ? escapeHtml(excerpt) : '',
        content: escapeHtml(content),
        category: escapeHtml(category),
        tags: Array.isArray(tags) ? tags.map((tag) => escapeHtml(tag)) : [],
        featuredImage: featuredImage || '',
        featured: featured === true,
        author: {
          uid: decodedToken.uid,
          name: decodedToken.name || decodedToken.email || 'Anonymous',
          email: decodedToken.email,
        },
        status: 'draft',
        views: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        publishedAt: null,
        approvedBy: null,
      };

      const docRef = await admin.firestore().collection('blogPosts').add(sanitizedData);

      return res.status(201).json({
        message: 'Blog post created successfully',
        postId: docRef.id,
        slug,
      });
    } catch (error) {
      console.error('Error creating blog post:', error);
      return res.status(500).json({ error: 'Failed to create blog post' });
    }
  });
});

const getBlogPosts = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, 'GET')) {
      return;
    }

    try {
      let isAdmin = false;

      try {
        const decodedToken = await verifyBearerToken(req);
        isAdmin = decodedToken?.admin === true;
      } catch (error) {
        isAdmin = false;
      }

      const { category, status, featured, authorUid } = req.query;
      let query = admin.firestore().collection('blogPosts');

      if (!isAdmin) {
        query = query.where('status', '==', 'published');
      } else if (status) {
        query = query.where('status', '==', status);
      }

      if (category) {
        query = query.where('category', '==', category);
      }

      if (featured === 'true') {
        query = query.where('featured', '==', true);
      }

      if (authorUid) {
        query = query.where('author.uid', '==', authorUid);
      }

      const snapshot = await query.limit(isAdmin ? 500 : 100).get();
      const posts = [];

      snapshot.forEach((doc) => {
        posts.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.().toISOString() || null,
          updatedAt: doc.data().updatedAt?.toDate?.().toISOString() || null,
          publishedAt: doc.data().publishedAt?.toDate?.().toISOString() || null,
        });
      });

      posts.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;

        const dateA = new Date(a.publishedAt || a.createdAt);
        const dateB = new Date(b.publishedAt || b.createdAt);
        return dateB - dateA;
      });

      return res.status(200).json({ posts, count: posts.length });
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
  });
});

const getBlogPost = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, 'GET')) {
      return;
    }

    try {
      const { slug } = req.query;

      if (!slug) {
        return res.status(400).json({ error: 'Slug is required' });
      }

      let isAdmin = false;

      try {
        const decodedToken = await verifyBearerToken(req);
        isAdmin = decodedToken?.admin === true;
      } catch (error) {
        isAdmin = false;
      }

      const snapshot = await admin.firestore()
        .collection('blogPosts')
        .where('slug', '==', slug)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      const doc = snapshot.docs[0];
      const post = {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.().toISOString() || null,
        updatedAt: doc.data().updatedAt?.toDate?.().toISOString() || null,
        publishedAt: doc.data().publishedAt?.toDate?.().toISOString() || null,
      };

      if (!isAdmin && post.status !== 'published') {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      if (!isAdmin && post.status === 'published') {
        await doc.ref.update({
          views: admin.firestore.FieldValue.increment(1),
        });
        post.views = (post.views || 0) + 1;
      }

      return res.status(200).json({ post });
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return res.status(500).json({ error: 'Failed to fetch blog post' });
    }
  });
});

const updateBlogPost = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, ['PUT', 'POST'])) {
      return;
    }

    try {
      const decodedToken = await requireAuth(req, res);
      if (!decodedToken) {
        return;
      }

      const { postId, title, excerpt, content, category, tags, featuredImage, featured, status } = req.body;

      if (!postId) {
        return res.status(400).json({ error: 'Post ID is required' });
      }

      const postRef = admin.firestore().collection('blogPosts').doc(postId);
      const postDoc = await postRef.get();

      if (!postDoc.exists) {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      const existingPost = postDoc.data();
      const isAdmin = decodedToken.admin === true;
      const isAuthor = existingPost.author.uid === decodedToken.uid;

      if (!isAdmin && (!isAuthor || existingPost.status !== 'draft')) {
        return res.status(403).json({ error: 'You can only update your own draft posts' });
      }

      const updateData = {
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      if (title) {
        updateData.title = escapeHtml(title);
        updateData.slug = createSlug(title);
      }
      if (excerpt !== undefined) updateData.excerpt = escapeHtml(excerpt);
      if (content) updateData.content = escapeHtml(content);
      if (category) updateData.category = escapeHtml(category);
      if (tags) updateData.tags = Array.isArray(tags) ? tags.map((tag) => escapeHtml(tag)) : [];
      if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
      if (featured !== undefined) updateData.featured = featured === true;
      if (status && isAdmin) {
        updateData.status = status;
      }

      await postRef.update(updateData);

      return res.status(200).json({ message: 'Blog post updated successfully' });
    } catch (error) {
      console.error('Error updating blog post:', error);
      return res.status(500).json({ error: 'Failed to update blog post' });
    }
  });
});

const submitBlogPostForApproval = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, 'POST')) {
      return;
    }

    try {
      const decodedToken = await requireAuth(req, res);
      if (!decodedToken) {
        return;
      }

      const { postId } = req.body;

      if (!postId) {
        return res.status(400).json({ error: 'Post ID is required' });
      }

      const postRef = admin.firestore().collection('blogPosts').doc(postId);
      const postDoc = await postRef.get();

      if (!postDoc.exists) {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      const existingPost = postDoc.data();

      if (existingPost.author.uid !== decodedToken.uid) {
        return res.status(403).json({ error: 'You can only submit your own posts' });
      }

      if (existingPost.status !== 'draft') {
        return res.status(400).json({ error: 'Only draft posts can be submitted for approval' });
      }

      await postRef.update({
        status: 'pending',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return res.status(200).json({ message: 'Blog post submitted for approval' });
    } catch (error) {
      console.error('Error submitting blog post:', error);
      return res.status(500).json({ error: 'Failed to submit blog post' });
    }
  });
});

const approveBlogPost = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, 'POST')) {
      return;
    }

    try {
      const decodedToken = await requireAdmin(req, res);
      if (!decodedToken) {
        return;
      }

      const { postId } = req.body;

      if (!postId) {
        return res.status(400).json({ error: 'Post ID is required' });
      }

      const postRef = admin.firestore().collection('blogPosts').doc(postId);
      const postDoc = await postRef.get();

      if (!postDoc.exists) {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      await postRef.update({
        status: 'published',
        publishedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        approvedBy: {
          uid: decodedToken.uid,
          name: decodedToken.name || decodedToken.email || 'Admin',
          email: decodedToken.email,
          approvedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
      });

      return res.status(200).json({ message: 'Blog post approved and published' });
    } catch (error) {
      console.error('Error approving blog post:', error);
      return res.status(500).json({ error: 'Failed to approve blog post' });
    }
  });
});

const rejectBlogPost = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, 'POST')) {
      return;
    }

    try {
      const decodedToken = await requireAdmin(req, res);
      if (!decodedToken) {
        return;
      }

      const { postId, feedback } = req.body;

      if (!postId) {
        return res.status(400).json({ error: 'Post ID is required' });
      }

      const postRef = admin.firestore().collection('blogPosts').doc(postId);
      const postDoc = await postRef.get();

      if (!postDoc.exists) {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      await postRef.update({
        status: 'draft',
        rejectionFeedback: feedback ? escapeHtml(feedback) : '',
        rejectedBy: {
          uid: decodedToken.uid,
          name: decodedToken.name || decodedToken.email || 'Admin',
          rejectedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return res.status(200).json({ message: 'Blog post rejected and returned to draft' });
    } catch (error) {
      console.error('Error rejecting blog post:', error);
      return res.status(500).json({ error: 'Failed to reject blog post' });
    }
  });
});

const deleteBlogPost = onRequest((req, res) => {
  cors(req, res, async () => {
    if (!ensureMethod(req, res, ['DELETE', 'POST'])) {
      return;
    }

    try {
      const decodedToken = await requireAdmin(req, res);
      if (!decodedToken) {
        return;
      }

      const postId = req.body.postId || req.query.postId;

      if (!postId) {
        return res.status(400).json({ error: 'Post ID is required' });
      }

      const postRef = admin.firestore().collection('blogPosts').doc(postId);
      const postDoc = await postRef.get();

      if (!postDoc.exists) {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      await postRef.delete();

      console.log(`Blog post deleted by ${decodedToken.email}: ${postId}`);
      return res.status(200).json({ message: 'Blog post deleted successfully' });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      return res.status(500).json({ error: 'Failed to delete blog post' });
    }
  });
});

module.exports = {
  createBlogPost,
  getBlogPosts,
  getBlogPost,
  updateBlogPost,
  submitBlogPostForApproval,
  approveBlogPost,
  rejectBlogPost,
  deleteBlogPost,
};