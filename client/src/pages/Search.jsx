import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/post/PostCard";
import { useDispatch, useSelector } from "react-redux";
import { getPostsAsync, selectTotalPosts, selectPost,selectLoader } from "../features/post/postSlice";

function Search() {
  const dispatch = useDispatch();
  const totalPost = useSelector(selectTotalPosts);
  const posts = useSelector(selectPost);
  const loading = useSelector(selectLoader);
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [limit, setLimit] = useState(5); // Initialize with a value to avoid multiple fetches
  const [filter, setFilter] = useState({});
  const [showMore, setShowMore] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm") || "";
    const sortFromUrl = urlParams.get("sort") || "desc";
    const categoryFromUrl = urlParams.get("category") || "uncategorized";

    setSidebarData({
      searchTerm: searchTermFromUrl,
      sort: sortFromUrl,
      category: categoryFromUrl,
    });

    const fetchPosts = async () => {
      const filterParams = {
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      };
      setFilter(filterParams);
    
      try {
        const result = await dispatch(getPostsAsync(filterParams)).unwrap();
        setLoading(false);
        if (result.posts.length >= totalPost) {
          setShowMore(false);
        } 
      } catch (error) {
  
        console.error("Failed to fetch posts:", error.message);
      }
    };
    fetchPosts();
  }, [location.search, dispatch, totalPost]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSidebarData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams(sidebarData).toString();
    navigate(`/search?${searchParams}`);
  };

  const handleShowMore = async () => {
    const newlimit = limit +5;
    setLimit(newlimit);
    const newFilter = { ...filter, limit:newlimit };
   
    try {
      const result = await dispatch(getPostsAsync(newFilter)).unwrap();

      if (result.posts.length >= totalPost) {
        setShowMore(false);
      }
    } catch (error) {
  
      console.error("Failed to fetch more posts:", error.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Left side bar start */}
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search Term:</label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              name="searchTerm"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select
              name="sort"
              onChange={handleChange}
              value={sidebarData.sort}
              id="sort"
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <Select
              name="category"
              onChange={handleChange}
              value={sidebarData.category}
              id="category"
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="javascript">JavaScript</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToPink">
            Apply Filters
          </Button>
        </form>
      </div>
      {/* Left side bar end */}

      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Posts results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && <p className="text-xl text-gray-500">No posts found.</p>}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading && posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-teal-500 text-lg hover:underline p-7 w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
