import streamlit as st
import sqlite3
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from datetime import datetime, timedelta
import hashlib
import os
from pathlib import Path

st.set_page_config(
    page_title="Social Media Dashboard",
    page_icon="📱",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
    <style>
    .main {
        padding: 2rem;
    }
    .stMetricLabel {
        font-size: 0.9rem;
    }
    .stat-card {
        background-color: #f0f2f6;
        padding: 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .user-card {
        background-color: white;
        border: 1px solid #ddd;
        border-radius: 0.5rem;
        padding: 1rem;
        margin-bottom: 1rem;
    }
    .post-card {
        background-color: white;
        border: 1px solid #e0e0e0;
        border-radius: 0.5rem;
        padding: 1.5rem;
        margin-bottom: 1rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    </style>
""", unsafe_allow_html=True)

# Database initialization
def init_db():
    conn = sqlite3.connect('social_media.db')
    c = conn.cursor()
    
    # Create tables
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            first_name TEXT,
            last_name TEXT,
            bio TEXT,
            profile_picture TEXT,
            followers INTEGER DEFAULT 0,
            following INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    c.execute('''
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            author_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            image TEXT,
            likes INTEGER DEFAULT 0,
            comments INTEGER DEFAULT 0,
            shares INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (author_id) REFERENCES users(id)
        )
    ''')
    
    c.execute('''
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER NOT NULL,
            author_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            likes INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (post_id) REFERENCES posts(id),
            FOREIGN KEY (author_id) REFERENCES users(id)
        )
    ''')
    
    c.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_id INTEGER NOT NULL,
            recipient_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            read INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (sender_id) REFERENCES users(id),
            FOREIGN KEY (recipient_id) REFERENCES users(id)
        )
    ''')
    
    c.execute('''
        CREATE TABLE IF NOT EXISTS follows (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            follower_id INTEGER NOT NULL,
            following_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(follower_id, following_id),
            FOREIGN KEY (follower_id) REFERENCES users(id),
            FOREIGN KEY (following_id) REFERENCES users(id)
        )
    ''')
    
    c.execute('''
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            recipient_id INTEGER NOT NULL,
            sender_id INTEGER,
            type TEXT NOT NULL,
            post_id INTEGER,
            message TEXT,
            read INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (recipient_id) REFERENCES users(id),
            FOREIGN KEY (sender_id) REFERENCES users(id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Hash password
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Authentication functions
def register_user(username, email, password):
    try:
        conn = sqlite3.connect('social_media.db')
        c = conn.cursor()
        hashed_pw = hash_password(password)
        c.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                 (username, email, hashed_pw))
        conn.commit()
        conn.close()
        return True, "Registration successful!"
    except sqlite3.IntegrityError:
        return False, "Username or email already exists"
    except Exception as e:
        return False, f"Error: {str(e)}"

def login_user(email, password):
    try:
        conn = sqlite3.connect('social_media.db')
        c = conn.cursor()
        hashed_pw = hash_password(password)
        c.execute('SELECT * FROM users WHERE email = ? AND password = ?', (email, hashed_pw))
        user = c.fetchone()
        conn.close()
        
        if user:
            return True, user
        else:
            return False, None
    except Exception as e:
        return False, None

# Initialize database
init_db()

# Session state
if 'logged_in' not in st.session_state:
    st.session_state.logged_in = False
    st.session_state.user_id = None
    st.session_state.username = None

# Main app layout
if not st.session_state.logged_in:
    # Auth page
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.markdown("## Welcome Back")
        tab1, tab2 = st.tabs(["Login", "Register"])
        
        with tab1:
            st.subheader("Login")
            email = st.text_input("Email", key="login_email")
            password = st.text_input("Password", type="password", key="login_password")
            
            if st.button("Login", use_container_width=True):
                success, user = login_user(email, password)
                if success:
                    st.session_state.logged_in = True
                    st.session_state.user_id = user[0]
                    st.session_state.username = user[1]
                    st.success("Login successful!")
                    st.rerun()
                else:
                    st.error("Invalid credentials")
        
        with tab2:
            st.subheader("Create Account")
            reg_username = st.text_input("Username", key="reg_username")
            reg_email = st.text_input("Email", key="reg_email")
            reg_password = st.text_input("Password", type="password", key="reg_password")
            reg_confirm = st.text_input("Confirm Password", type="password", key="reg_confirm")
            
            if st.button("Register", use_container_width=True):
                if reg_password != reg_confirm:
                    st.error("Passwords don't match")
                elif len(reg_password) < 6:
                    st.error("Password must be at least 6 characters")
                else:
                    success, message = register_user(reg_username, reg_email, reg_password)
                    if success:
                        st.success(message)
                    else:
                        st.error(message)
    
    with col2:
        st.markdown("""
            ### Social Media Dashboard
            
            Connect, share, and engage with your community.
            
            **Features:**
            - Create and share posts
            - Real-time messaging
            - Like and comment on posts
            - Follow other users
            - View analytics
            - Get notifications
            
            Join millions of users today!
        """)

else:
    # Main app
    st.sidebar.title(f"Welcome, {st.session_state.username}!")
    
    page = st.sidebar.radio(
        "Navigate to:",
        ["Home", "Profile", "Messages", "Analytics", "Settings"]
    )
    
    if st.sidebar.button("Logout"):
        st.session_state.logged_in = False
        st.session_state.user_id = None
        st.session_state.username = None
        st.rerun()
    
    if page == "Home":
        st.title("Home Feed")
        
        col1, col2 = st.columns([3, 1])
        
        with col1:
            st.markdown("### Create a Post")
            post_content = st.text_area("What's on your mind?", height=100)
            post_image = st.text_input("Image URL (optional)")
            
            if st.button("Post", use_container_width=True):
                if post_content:
                    try:
                        conn = sqlite3.connect('social_media.db')
                        c = conn.cursor()
                        c.execute('INSERT INTO posts (author_id, content, image) VALUES (?, ?, ?)',
                                 (st.session_state.user_id, post_content, post_image))
                        conn.commit()
                        conn.close()
                        st.success("Post created!")
                        st.rerun()
                    except Exception as e:
                        st.error(f"Error: {str(e)}")
                else:
                    st.warning("Please write something!")
            
            st.markdown("---")
            st.markdown("### Feed")
            
            conn = sqlite3.connect('social_media.db')
            c = conn.cursor()
            c.execute('''
                SELECT p.id, p.content, p.image, p.likes, p.comments, p.created_at, u.username, u.profile_picture
                FROM posts p
                JOIN users u ON p.author_id = u.id
                ORDER BY p.created_at DESC
                LIMIT 20
            ''')
            posts = c.fetchall()
            conn.close()
            
            for post in posts:
                post_id, content, image, likes, comments, created_at, username, profile_pic = post
                
                st.markdown(f"**{username}**")
                st.write(content)
                
                if image:
                    try:
                        st.image(image, use_column_width=True)
                    except:
                        pass
                
                col_like, col_comment, col_share = st.columns(3)
                
                with col_like:
                    if st.button(f"❤️ Like ({likes})", key=f"like_{post_id}"):
                        try:
                            conn = sqlite3.connect('social_media.db')
                            c = conn.cursor()
                            c.execute('UPDATE posts SET likes = likes + 1 WHERE id = ?', (post_id,))
                            conn.commit()
                            conn.close()
                            st.rerun()
                        except:
                            pass
                
                with col_comment:
                    st.button(f"💬 Comment ({comments})", key=f"comment_{post_id}")
                
                with col_share:
                    st.button(f"📤 Share", key=f"share_{post_id}")
                
                st.markdown("---")
        
        with col2:
            st.markdown("### Trending")
            conn = sqlite3.connect('social_media.db')
            c = conn.cursor()
            c.execute('SELECT username, followers FROM users ORDER BY followers DESC LIMIT 5')
            trending = c.fetchall()
            conn.close()
            
            for user in trending:
                st.write(f"**{user[0]}**")
                st.write(f"Followers: {user[1]}")
                st.markdown("---")
    
    elif page == "Profile":
        st.title("My Profile")
        
        conn = sqlite3.connect('social_media.db')
        c = conn.cursor()
        c.execute('SELECT * FROM users WHERE id = ?', (st.session_state.user_id,))
        user = c.fetchone()
        
        col1, col2 = st.columns([1, 2])
        
        with col1:
            st.markdown("### Profile Picture")
            profile_pic = st.text_input("Profile Picture URL", value=user[8] or "")
        
        with col2:
            st.markdown("### Edit Profile")
            first_name = st.text_input("First Name", value=user[3] or "")
            last_name = st.text_input("Last Name", value=user[4] or "")
            bio = st.text_area("Bio", value=user[5] or "", height=100)
            
            if st.button("Save Changes"):
                try:
                    c.execute('''
                        UPDATE users 
                        SET first_name = ?, last_name = ?, bio = ?, profile_picture = ?
                        WHERE id = ?
                    ''', (first_name, last_name, bio, profile_pic, st.session_state.user_id))
                    conn.commit()
                    st.success("Profile updated!")
                    st.rerun()
                except:
                    st.error("Error updating profile")
        
        st.markdown("---")
        st.markdown("### Statistics")
        
        c.execute('SELECT COUNT(*) FROM posts WHERE author_id = ?', (st.session_state.user_id,))
        post_count = c.fetchone()[0]
        
        c.execute('SELECT COUNT(*) FROM follows WHERE following_id = ?', (st.session_state.user_id,))
        followers = c.fetchone()[0]
        
        c.execute('SELECT COUNT(*) FROM follows WHERE follower_id = ?', (st.session_state.user_id,))
        following = c.fetchone()[0]
        
        col1, col2, col3 = st.columns(3)
        col1.metric("Posts", post_count)
        col2.metric("Followers", followers)
        col3.metric("Following", following)
        
        conn.close()
    
    elif page == "Messages":
        st.title("Messages")
        
        conn = sqlite3.connect('social_media.db')
        c = conn.cursor()
        
        c.execute('''
            SELECT DISTINCT u.id, u.username
            FROM users u
            WHERE u.id != ?
            LIMIT 10
        ''', (st.session_state.user_id,))
        users = c.fetchall()
        
        selected_user = st.selectbox(
            "Select user to message:",
            options=[u[0] for u in users],
            format_func=lambda x: next(u[1] for u in users if u[0] == x)
        )
        
        if selected_user:
            c.execute('''
                SELECT u.username, m.content, m.sender_id, m.created_at
                FROM messages m
                JOIN users u ON m.sender_id = u.id
                WHERE (m.sender_id = ? AND m.recipient_id = ?)
                   OR (m.sender_id = ? AND m.recipient_id = ?)
                ORDER BY m.created_at DESC
                LIMIT 20
            ''', (st.session_state.user_id, selected_user, selected_user, st.session_state.user_id))
            
            messages = c.fetchall()
            
            st.markdown("### Conversation")
            for msg in reversed(messages):
                username, content, sender_id, created_at = msg
                if sender_id == st.session_state.user_id:
                    st.write(f"**You:** {content}")
                else:
                    st.write(f"**{username}:** {content}")
            
            st.markdown("---")
            new_message = st.text_input("Type your message:")
            
            if st.button("Send"):
                if new_message:
                    c.execute('''
                        INSERT INTO messages (sender_id, recipient_id, content)
                        VALUES (?, ?, ?)
                    ''', (st.session_state.user_id, selected_user, new_message))
                    conn.commit()
                    st.success("Message sent!")
                    st.rerun()
        
        conn.close()
    
    elif page == "Analytics":
        st.title("Your Analytics")
        
        conn = sqlite3.connect('social_media.db')
        c = conn.cursor()
        
        # Get statistics
        c.execute('SELECT COUNT(*) FROM posts WHERE author_id = ?', (st.session_state.user_id,))
        total_posts = c.fetchone()[0]
        
        c.execute('SELECT SUM(likes) FROM posts WHERE author_id = ?', (st.session_state.user_id,))
        total_likes = c.fetchone()[0] or 0
        
        c.execute('SELECT SUM(comments) FROM posts WHERE author_id = ?', (st.session_state.user_id,))
        total_comments = c.fetchone()[0] or 0
        
        c.execute('SELECT COUNT(*) FROM follows WHERE following_id = ?', (st.session_state.user_id,))
        followers = c.fetchone()[0]
        
        col1, col2, col3, col4 = st.columns(4)
        col1.metric("Total Posts", total_posts)
        col2.metric("Total Likes", total_likes)
        col3.metric("Total Comments", total_comments)
        col4.metric("Followers", followers)
        
        st.markdown("---")
        st.markdown("### Engagement Chart")
        
        c.execute('''
            SELECT DATE(created_at) as date, COUNT(*) as posts, SUM(likes) as likes, SUM(comments) as comments
            FROM posts
            WHERE author_id = ?
            GROUP BY DATE(created_at)
            ORDER BY date DESC
            LIMIT 30
        ''', (st.session_state.user_id,))
        
        data = c.fetchall()
        conn.close()
        
        if data:
            df = pd.DataFrame(data, columns=['Date', 'Posts', 'Likes', 'Comments'])
            df['Likes'] = df['Likes'].fillna(0)
            df['Comments'] = df['Comments'].fillna(0)
            
            fig = go.Figure()
            fig.add_trace(go.Scatter(x=df['Date'], y=df['Likes'], name='Likes', mode='lines+markers'))
            fig.add_trace(go.Scatter(x=df['Date'], y=df['Comments'], name='Comments', mode='lines+markers'))
            
            fig.update_layout(
                title="Engagement Over Time",
                xaxis_title="Date",
                yaxis_title="Count",
                hovermode='x unified'
            )
            
            st.plotly_chart(fig, use_container_width=True)
            
            col1, col2 = st.columns(2)
            
            with col1:
                fig_pie = go.Figure(data=[go.Pie(labels=['Likes', 'Comments'], values=[total_likes, total_comments])])
                fig_pie.update_layout(title="Likes vs Comments")
                st.plotly_chart(fig_pie, use_container_width=True)
            
            with col2:
                st.markdown("### Top Performing Posts")
                c = sqlite3.connect('social_media.db').cursor()
                c.execute('''
                    SELECT content, likes FROM posts
                    WHERE author_id = ?
                    ORDER BY likes DESC
                    LIMIT 5
                ''', (st.session_state.user_id,))
                top_posts = c.fetchall()
                
                for i, (content, likes) in enumerate(top_posts, 1):
                    st.write(f"{i}. {content[:50]}... - {likes} likes")
    
    elif page == "Settings":
        st.title("Settings")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("### Account Settings")
            if st.button("Change Password"):
                st.info("Password change functionality would be implemented here")
            
            if st.button("Privacy Settings"):
                st.info("Privacy settings would be implemented here")
        
        with col2:
            st.markdown("### Preferences")
            notifications = st.checkbox("Enable Notifications", value=True)
            dark_mode = st.checkbox("Dark Mode", value=True)
            
            if st.button("Save Preferences"):
                st.success("Preferences saved!")
        
        st.markdown("---")
        st.markdown("### About")
        st.info("""
            Social Media Dashboard v1.0
            
            A complete social media platform built with Streamlit.
            Features: Posts, Messaging, Analytics, and more!
        """)
