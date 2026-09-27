import React, { useState, useMemo, useEffect, use } from "react";
import { BookOpen, FileText, Video, Link2, Download, Search, Library, PlayCircle, File, FileSpreadsheet } from "lucide-react";
import { AuthContext } from '../AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';

const typeConfig = {
  slide: { icon: FileText, cls: "primary", label: "Slide" },
  video: { icon: Video, cls: "danger", label: "Video" },
  document: { icon: File, cls: "success", label: "Document" },
  spreadsheet: { icon: FileSpreadsheet, cls: "info", label: "Spreadsheet" },
  link: { icon: Link2, cls: "secondary", label: "Link" },
};

export default function LearningResources() {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [typeFilter, setTypeFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    axiosSecure.get('/learning-resources')
      .then(res => {
        if (cancelled) return;
        setCourses(res.data.courses || []);
        setResources(res.data.resources || []);
      })
      .catch(alert)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchCourse = courseFilter === "All Courses" || r.course === courseFilter;
      const matchType = typeFilter === "all" || r.type === typeFilter;
      const matchQuery = !query || r.title.toLowerCase().includes(query.toLowerCase());
      return matchCourse && matchType && matchQuery;
    });
  }, [courseFilter, typeFilter, query, resources]);

  const summary = useMemo(() => {
    return {
      total: resources.length,
      videos: resources.filter((r) => r.type === "video").length,
      documents: resources.filter((r) => r.type === "document" || r.type === "slide").length,
    };
  }, [resources]);

  if (!user || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="container-fluid p-3 p-md-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <div><h2 className='fw-bold m-0'>Learning Resources</h2></div>
          <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
            <Library size={14} /> E-Library
          </button>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                  <BookOpen size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-muted small">Total Resources</div>
                  <div className="fw-bold">{summary.total}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="rounded-circle bg-danger bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                  <Video size={20} className="text-danger" />
                </div>
                <div>
                  <div className="text-muted small">Video Lectures</div>
                  <div className="fw-bold">{summary.videos}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                  <FileText size={20} className="text-success" />
                </div>
                <div>
                  <div className="text-muted small">Documents & Slides</div>
                  <div className="fw-bold">{summary.documents}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm mb-3">
          <div className="card-body">
            <div className="row g-2 align-items-center">
              <div className="col-12 col-md-5">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white"><Search size={14} /></span>
                  <input type="text" className="form-control" placeholder="Search resources..." value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
              </div>
              <div className="col-6 col-md-4">
                <select className="form-select form-select-sm" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
                  {courses.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
              <div className="col-6 col-md-3">
                <select className="form-select form-select-sm" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  <option value="all">All Types</option>
                  <option value="slide">Slides</option>
                  <option value="video">Videos</option>
                  <option value="document">Documents</option>
                  <option value="spreadsheet">Spreadsheets</option>
                  <option value="link">Links</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3">
          {filtered.map((r) => {
            const conf = typeConfig[r.type];
            const Icon = conf.icon;
            return (
              <div className="col-12 col-md-6 col-lg-4" key={r._id}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex align-items-start gap-2 mb-2">
                      <div className={`rounded bg-${conf.cls} bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0`} style={{ width: 38, height: 38 }}>
                        <Icon size={18} className={`text-${conf.cls}`} />
                      </div>
                      <div>
                        <div className="fw-semibold small">{r.title}</div>
                        <div className="text-muted" style={{ fontSize: 11 }}>{r.course}</div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
                      <span className={`badge bg-${conf.cls} bg-opacity-10 text-${conf.cls} border border-${conf.cls} rounded-pill`}>{r.format}</span>
                      <span className="text-muted" style={{ fontSize: 11 }}>{r.uploadedOn}</span>
                    </div>
                    <button className="btn btn-outline-primary btn-sm mt-2 d-flex align-items-center justify-content-center gap-1">
                      {r.type === "video" ? (<><PlayCircle size={13} /> Watch</>) : r.type === "link" ? (<><Link2 size={13} /> Open Link</>) : (<><Download size={13} /> Download</>)}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-muted py-5">No resources match your search or filters.</div>
        )}
      </div>
    </div>
  );
}
